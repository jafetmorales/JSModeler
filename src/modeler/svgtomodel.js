JSM.SvgToModel = function (svgObject, segmentation)
{
	function SegmentPath (svgObject, path, segmentation)
	{
		function AddTransformedVertex (result, contour, svgObject, path, x, y)
		{
			var point = svgObject.createSVGPoint ();
			point.x = x;
			point.y = y;
			
			var transformed = point.matrixTransform (path.getCTM ());
			var transformedCoord = new JSM.Coord2D (x, y);
			
			var contourVertexCount = result.VertexCount (contour);
			if (contourVertexCount > 0) {
				if (JSM.CoordIsEqual2DWithEps (result.GetVertex (contour, contourVertexCount - 1), transformedCoord, 0.1)) {
					return transformedCoord;
				}
			}
			
			result.AddVertex (contour, transformed.x, transformed.y);
			return transformedCoord;
		}

		function SegmentCurve (svgObject, originalPath, segmentation, lastCoord, items, result, currentContour)
		{
			function CreatePath (items, result, currentContour)
			{
				function GenerateMoveCommand (x, y)
				{
					return 'M ' + x + ' ' + y;
				}
			
				var svgNameSpace = "http://www.w3.org/2000/svg";
				var path = document.createElementNS (svgNameSpace, 'path');

				var commandString = GenerateMoveCommand (lastCoord.x, lastCoord.y);
				var i, item, command, largeArcFlag, sweepFlag;
				for (i = 0; i < items.length; i++) {
					item = items[i]
					if (item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS ||
						item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL) {
						command = (item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS ? 'C' : 'c');
						commandString += command + ' ' + item.x1 + ' ' + item.y1 + ' ' + item.x2 + ' ' + item.y2 + ' ' + item.x + ' ' + item.y + ' ';
					} else if (item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS ||
							   item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL){
						command = (item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS ? 'Q' : 'q');
						commandString += command + ' ' + item.x1 + ' ' + item.y1 + ' ' + item.x + ' ' + item.y + ' ';
					} else if (item.pathSegType == SVGPathSeg.PATHSEG_ARC_ABS ||
							   item.pathSegType == SVGPathSeg.PATHSEG_ARC_REL){
						command = (item.pathSegType == SVGPathSeg.PATHSEG_ARC_ABS ? 'A' : 'a');
						largeArcFlag = (item.largeArcFlag ? 1 : 0);
						sweepFlag = (item.sweepFlag ? 1 : 0);
						commandString +=  command + ' ' + item.r1 + ' ' + item.r2 + ' ' + item.angle + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' + item.x + ' ' + item.y + ' ';
					} else if (item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS ||
							   item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL){
						command = (item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS ? 'S' : 's');
						commandString +=  command + ' ' + item.x2 + ' ' + item.y2 + ' ' + item.x + ' ' + item.y + ' ';
					} else {
						alert ('SegmentCurve unknown segment type: ' + item.pathSegType);
					}
				}
				
				path.setAttributeNS (null, 'd', commandString);
				return path;
			}
		
			var path = CreatePath (items, result, currentContour);
			var step = path.getTotalLength () / segmentation;
			var i, point;
			for (i = 1; i <= segmentation; i++) {
				point = path.getPointAtLength (i * step);
				lastCoord = AddTransformedVertex (result, currentContour, svgObject, originalPath, point.x, point.y);
			}
			
			return lastCoord;
		}
		
		function IsCurvedItem (item)
		{
			return item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS ||
				   item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL ||
				   item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS ||
				   item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL ||
				   item.pathSegType == SVGPathSeg.PATHSEG_ARC_ABS ||
				   item.pathSegType == SVGPathSeg.PATHSEG_ARC_REL ||
				   item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS ||
				   item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL;
		}
		
		function RemoveEqualEndVertices (polygon, contour)
		{
			var vertexCount = polygon.VertexCount (contour);
			if (vertexCount == 0) {
				return;
			}
			
			var firstCoord = polygon.GetVertex (contour, 0);
			var lastCoord = polygon.GetVertex (contour, vertexCount - 1);
			if (JSM.CoordIsEqual2DWithEps (firstCoord, lastCoord, 0.1)) {
				polygon.GetContour (contour).vertices.pop ();
			}
		}				
	
		function StartNewContour (result, contour)
		{
			if (result.VertexCount (contour) > 0) {
				RemoveEqualEndVertices (result, contour);
				result.AddContour ();
				return contour + 1;
			}
			return contour;
		}
	
		var result = new JSM.ContourPolygon2D ();
		var lastCoord = new JSM.Coord2D (0.0, 0.0);
		var lastMoveCoord = new JSM.Coord2D (0.0, 0.0);
		
		var i, j, item, items, currentItem;
		var currentContour = 0;
		for (i = 0; i < path.pathSegList.numberOfItems; i++) {
			item = path.pathSegList.getItem (i);
			if (item.pathSegType == SVGPathSeg.PATHSEG_CLOSEPATH) {
				// do nothing
			} else if (item.pathSegType == SVGPathSeg.PATHSEG_MOVETO_ABS) {
				currentContour = StartNewContour (result, currentContour);
				lastCoord = AddTransformedVertex (result, currentContour, svgObject, path, item.x, item.y);
				lastMoveCoord = lastCoord.Clone ();
			} else if (item.pathSegType == SVGPathSeg.PATHSEG_MOVETO_REL) {
				currentContour = StartNewContour (result, currentContour);
				lastCoord = AddTransformedVertex (result, currentContour, svgObject, path, lastMoveCoord.x + item.x, lastMoveCoord.y + item.y);
				lastMoveCoord = lastCoord.Clone ();
			} else if (item.pathSegType == SVGPathSeg.PATHSEG_LINETO_ABS) {
				lastCoord = AddTransformedVertex (result, currentContour, svgObject, path, item.x, item.y);
			} else if (item.pathSegType == SVGPathSeg.PATHSEG_LINETO_REL) {
				lastCoord = AddTransformedVertex (result, currentContour, svgObject, path, lastCoord.x + item.x, lastCoord.y + item.y);
			} else if (item.pathSegType == SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS) {
				lastCoord = AddTransformedVertex (result, currentContour, svgObject, path, item.x, lastCoord.y);
			} else if (item.pathSegType == SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS) {
				lastCoord = AddTransformedVertex (result, currentContour, svgObject, path, lastCoord.x, item.y);
			} else if (item.pathSegType == SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL) {
				lastCoord = AddTransformedVertex (result, currentContour, svgObject, path, lastCoord.x + item.x, lastCoord.y);
			} else if (item.pathSegType == SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL) {
				lastCoord = AddTransformedVertex (result, currentContour, svgObject, path, lastCoord.x, lastCoord.y + item.y);
			} else if (IsCurvedItem (item)) {
				items = [];
				for (j = i; j < path.pathSegList.numberOfItems; j++) {
					currentItem = path.pathSegList.getItem (j);
					if (!IsCurvedItem (currentItem)) {
						break;
					}
					items.push (currentItem);
				}
				i = j - 1;
				lastCoord = SegmentCurve (svgObject, path, segmentation, lastCoord, items, result, currentContour);
			} else {
				alert ('unknown segment type: ' + item.pathSegType);
			}
		}
		
		RemoveEqualEndVertices (result, currentContour);
		return result;
	}
	
	function SegmentPaths (svgObject, segmentation)
	{
		var result = [];
		var paths = svgObject.getElementsByTagName ('path');
		
		var i, current;
		for (i = 0; i < paths.length; i++) {
			current = SegmentPath (svgObject, paths[i], segmentation);
			result.push (current);
		}
		
		return result;
	}
	
	function ContourPolygonToPrisms (polygon)
	{
		function CreateBasePolygon (polygon)
		{
			var basePolygon = [];
			
			var i, coord;
			for (i = 0; i < polygon.VertexCount (); i++) {
				coord = polygon.GetVertex (i);
				basePolygon.push (new JSM.Coord (coord.x, 0.0, -coord.y));
			}

			return basePolygon;
		}
	
		function AddHoleToBasePolygon (basePolygon, polygon)
		{
			basePolygon.push (null);
		
			var i, coord;
			for (i = 0; i < polygon.VertexCount (); i++) {
				coord = polygon.GetVertex (i);
				basePolygon.push (new JSM.Coord (coord.x, 0.0, -coord.y));
			}
		}

		var prisms = [];
		var direction = new JSM.Vector (0.0, 1.0, 0.0);
		
		var basePolygon, prism;
		var contourCount = polygon.ContourCount ();
		if (contourCount == 1) {
			basePolygon = CreateBasePolygon (polygon.GetContour (0))
			prism = JSM.GeneratePrism (basePolygon, direction, 10.0, true);
			prisms.push (prism);
		} else if (contourCount > 1) {
			var baseOrientation = JSM.PolygonOrientation2D (polygon.GetContour (0));
			var holeBasePolygon = CreateBasePolygon (polygon.GetContour (0));
			var hasHoles = false;
			
			var i, orientation;
			for (i = 1; i < polygon.ContourCount (); i++) {
				orientation = JSM.PolygonOrientation2D (polygon.GetContour (i));
				if (orientation == baseOrientation) {
					basePolygon = CreateBasePolygon (polygon.GetContour (i))
					prism = JSM.GeneratePrism (basePolygon, direction, 10.0, true);
					prisms.push (prism);
				} else {
					AddHoleToBasePolygon (holeBasePolygon, polygon.GetContour (i));
					hasHoles = true;
				}
			}
			
			if (!hasHoles) {
				prism = JSM.GeneratePrism (holeBasePolygon, direction, 10.0, true);
				prisms.push (prism);
			} else {
				prism = JSM.GeneratePrismWithHole (holeBasePolygon, direction, 10.0, true);
				prisms.push (prism);
			}
		}
		
		return prisms;
	}
	
	var model = new JSM.Model ();
	var polygons = SegmentPaths (svgObject, segmentation);
	
	var i, j, prisms;
	for (i = 0; i < polygons.length; i++) {
		prisms = ContourPolygonToPrisms (polygons[i]);
		for (j = 0; j < prisms.length; j++) {
			model.AddBody (prisms[j]);
		}
	}

	return model;
}

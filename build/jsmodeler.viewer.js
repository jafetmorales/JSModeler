/* JSModeler 0.40 - http://www.github.com/kovacsv/JSModeler */ 'use strict';JSM.ConvertBodyToThreeMeshes=function(a,b,e){var d={textureLoadedCallback:null,hasConvexPolygons:!1};void 0!==e&&null!==e&&(d.textureLoadedCallback=JSM.ValueOrDefault(e.textureLoadedCallback,d.textureLoadedCallback),d.hasConvexPolygons=JSM.ValueOrDefault(e.hasConvexPolygons,d.hasConvexPolygons));var f=[],c=null,g=null;JSM.ExplodeBody(a,b,{hasConvexPolygons:d.hasConvexPolygons,onPointGeometryStart:function(a){g=new THREE.PointCloudMaterial({ambient:a.ambient,color:a.diffuse,size:a.pointSize});
c=new THREE.Geometry},onPointGeometryEnd:function(){var a=new THREE.PointCloud(c,g);f.push(a)},onPoint:function(a){c.vertices.push(new THREE.Vector3(a.x,a.y,a.z))},onLineGeometryStart:function(a){g=new THREE.LineBasicMaterial({ambient:a.ambient,color:a.diffuse})},onLineGeometryEnd:function(){},onLine:function(a,b){var c=new THREE.Geometry;c.vertices.push(new THREE.Vector3(a.x,a.y,a.z));c.vertices.push(new THREE.Vector3(b.x,b.y,b.z));c=new THREE.Line(c,g);f.push(c)},onGeometryStart:function(a){var b=
null!==a.texture,e=1!==a.opacity,f=a.ambient,I=a.diffuse,G=a.specular,k=a.shininess;0===k&&(G=0,k=1);g=new THREE.MeshPhongMaterial({ambient:f,color:I,specular:G,shininess:k});a.singleSided||(g.side=THREE.DoubleSide);e&&(g.opacity=a.opacity,g.transparent=!0);if(b){var l=THREE.ImageUtils.loadTexture(a.texture,new THREE.UVMapping,function(){l.image=JSM.ResizeImageToPowerOfTwoSides(l.image);null!==d.textureLoadedCallback&&d.textureLoadedCallback()});l.wrapS=THREE.RepeatWrapping;l.wrapT=THREE.RepeatWrapping;
g.map=l}c=new THREE.Geometry},onGeometryEnd:function(){c.computeFaceNormals();var a=new THREE.Mesh(c,g);f.push(a)},onTriangle:function(a,b,d,e,f,g,k,l,p){var F=c.vertices.length;c.vertices.push(new THREE.Vector3(a.x,a.y,a.z));c.vertices.push(new THREE.Vector3(b.x,b.y,b.z));c.vertices.push(new THREE.Vector3(d.x,d.y,d.z));a=new THREE.Face3(F+0,F+1,F+2);c.faces.push(a);null!==e&&(null!==f&&null!==g)&&(a=[],a.push(new THREE.Vector3(e.x,e.y,e.z)),a.push(new THREE.Vector3(f.x,f.y,f.z)),a.push(new THREE.Vector3(g.x,
g.y,g.z)),c.faces[c.faces.length-1].vertexNormals=a);null!==k&&(null!==l&&null!==p)&&(e=[],e.push(new THREE.Vector2(k.x,-k.y)),e.push(new THREE.Vector2(l.x,-l.y)),e.push(new THREE.Vector2(p.x,-p.y)),c.faceVertexUvs[0].push(e))}});return f};JSM.ConvertModelToThreeMeshes=function(a,b,e){var d=[],f,c,g;for(f=0;f<a.BodyCount();f++){c=a.GetBody(f);g=JSM.ConvertBodyToThreeMeshes(c,b,e);for(c=0;c<g.length;c++)d.push(g[c])}return d};
JSM.ConvertJSONDataToThreeMeshes=function(a,b,e){function d(a,e,d){function f(a,d){function p(a,b,c,e,d){c=new THREE.Vector2(a,b);JSM.IsZero(d)||(e=Math.sin(d*JSM.DegRad),d=Math.cos(d*JSM.DegRad),c.x=d*a-e*b,c.y=e*a+d*b);c.x=t[0]+c.x*u[0];c.y=t[1]+c.y*u[1];return c}var m=a.parameters,h=c[a.material],v=h.texture,t=h.offset,u=h.scale,z=h.rotation,w=new THREE.Color,x=new THREE.Color,y=new THREE.Color,A=h.shininess;w.setRGB(h.ambient[0],h.ambient[1],h.ambient[2]);x.setRGB(h.diffuse[0],h.diffuse[1],h.diffuse[2]);
y.setRGB(h.specular[0],h.specular[1],h.specular[2]);if(void 0!==v&&null!==v){w.setRGB(1,1,1);x.setRGB(1,1,1);y.setRGB(1,1,1);if(void 0===t||null===t)t=[0,0];if(void 0===u||null===u)u=[1,1];if(void 0===z||null===z)z=0}0===A&&(y.setRGB(0,0,0),A=1);w=new THREE.MeshPhongMaterial({ambient:x.getHex(),color:x.getHex(),specular:y.getHex(),shininess:A,side:THREE.DoubleSide});1!==h.opacity&&(w.opacity=h.opacity,w.transparent=!0);void 0!==v&&null!==v&&(h=THREE.ImageUtils.loadTexture(v,new THREE.UVMapping,function(a){a.image=
JSM.ResizeImageToPowerOfTwoSides(a.image);void 0!==b&&null!==b&&b()}),h.wrapS=THREE.RepeatWrapping,h.wrapT=THREE.RepeatWrapping,w.map=h);var h=new THREE.Geometry,r,q,B,s,C,D,E,H,n;for(n=0;n<m.length;n+=9)r=3*m[n+0],q=3*m[n+1],B=3*m[n+2],s=3*m[n+3],C=3*m[n+4],D=3*m[n+5],x=2*m[n+6],y=2*m[n+7],A=2*m[n+8],E=h.vertices.length,H=h.faces.length,h.vertices.push(new THREE.Vector3(g[r+0],g[r+1],g[r+2])),h.vertices.push(new THREE.Vector3(g[q+0],g[q+1],g[q+2])),h.vertices.push(new THREE.Vector3(g[B+0],g[B+1],
g[B+2])),h.faces.push(new THREE.Face3(E+0,E+1,E+2)),r=[],r.push(new THREE.Vector3(k[s+0],k[s+1],k[s+2])),r.push(new THREE.Vector3(k[C+0],k[C+1],k[C+2])),r.push(new THREE.Vector3(k[D+0],k[D+1],k[D+2])),h.faces[H].vertexNormals=r,void 0!==v&&null!==v&&(s=[],s.push(p(l[x+0],l[x+1],t,u,z)),s.push(p(l[y+0],l[y+1],t,u,z)),s.push(p(l[A+0],l[A+1],t,u,z)),h.faceVertexUvs[0].push(s));m=new THREE.Mesh(h,w);m.originalJsonIndex=e;d.push(m)}var g=a.vertices;if(void 0!==g){var k=a.normals;if(void 0!==k){var l=a.uvs;
if(void 0!==l){a=a.triangles;var p;for(p=0;p<a.length;p++)f(a[p],d)}}}}var f=[],c=a.materials;if(void 0===c)return f;var g=a.meshes;if(void 0===g)return f;var q=0;JSM.AsyncRunTask(function(){d(g[q],q,f);q+=1;return!0},e,g.length,0,f);return f};JSM.JSONFileConverter=function(a,b){this.onReady=a;this.onTextureLoaded=b};JSM.JSONFileConverter.prototype.Convert=function(a){(new JSM.JSONFileLoader(this.OnReady.bind(this))).Load(a)};
JSM.JSONFileConverter.prototype.OnReady=function(a){null!==this.onReady&&(a=JSM.ConvertJSONDataToThreeMeshes(a,this.onTextureLoaded),this.onReady(a))};JSM.ThreeViewer=function(){this.enableDraw=this.drawLoop=this.settings=this.navigation=this.cameraMove=this.runAfterRender=this.runBeforeRender=this.directionalLight=this.ambientLight=this.renderer=this.camera=this.scene=this.canvas=null};
JSM.ThreeViewer.prototype.Start=function(a,b){if(!JSM.IsWebGLEnabled()||!this.InitSettings(b)||!this.InitThree(a)||!this.InitCamera(b)||!this.InitLights())return!1;this.drawLoop=!1;this.enableDraw=!0;this.DrawIfNeeded();return!0};
JSM.ThreeViewer.prototype.InitSettings=function(a){this.settings={cameraEyePosition:new JSM.Coord(1,1,1),cameraCenterPosition:new JSM.Coord(0,0,0),cameraUpVector:new JSM.Coord(0,0,1),lightAmbientColor:[0.5,0.5,0.5],lightDiffuseColor:[0.5,0.5,0.5]};void 0!==a&&(void 0!==a.cameraEyePosition&&(this.settings.cameraEyePosition=JSM.CoordFromArray(a.cameraEyePosition)),void 0!==a.cameraCenterPosition&&(this.settings.cameraCenterPosition=JSM.CoordFromArray(a.cameraCenterPosition)),void 0!==a.cameraUpVector&&
(this.settings.cameraUpVector=JSM.CoordFromArray(a.cameraUpVector)),void 0!==a.lightAmbientColor&&(this.settings.lightAmbientColor=a.lightAmbientColor),void 0!==a.lightDiffuseColor&&(this.settings.lightDiffuseColor=a.lightDiffuseColor));return!0};
JSM.ThreeViewer.prototype.InitThree=function(a){this.canvas=a;if(!this.canvas||!this.canvas.getContext)return!1;this.scene=new THREE.Scene;if(!this.scene)return!1;this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,antialias:!0});if(!this.renderer)return!1;this.renderer.setClearColor(new THREE.Color(16777215));this.renderer.setSize(this.canvas.width,this.canvas.height);return!0};
JSM.ThreeViewer.prototype.InitCamera=function(a){this.cameraMove=new JSM.Camera(JSM.CoordFromArray(a.cameraEyePosition),JSM.CoordFromArray(a.cameraCenterPosition),JSM.CoordFromArray(a.cameraUpVector),a.fieldOfView,a.nearClippingPlane,a.farClippingPlane);if(!this.cameraMove)return!1;this.navigation=new JSM.Navigation;if(!this.navigation.Init(this.canvas,this.cameraMove,this.DrawIfNeeded.bind(this),this.Resize.bind(this)))return!1;this.camera=new THREE.PerspectiveCamera(this.cameraMove.fieldOfView,
this.canvas.width/this.canvas.height,this.cameraMove.nearClippingPlane,this.cameraMove.farClippingPlane);if(!this.camera)return!1;this.scene.add(this.camera);return!0};
JSM.ThreeViewer.prototype.InitLights=function(){var a=new THREE.Color,b=new THREE.Color;a.setRGB(this.settings.lightAmbientColor[0],this.settings.lightAmbientColor[1],this.settings.lightAmbientColor[2]);b.setRGB(this.settings.lightDiffuseColor[0],this.settings.lightDiffuseColor[1],this.settings.lightDiffuseColor[2]);this.ambientLight=new THREE.AmbientLight(a.getHex());if(!this.ambientLight)return!1;this.scene.add(this.ambientLight);this.directionalLight=new THREE.DirectionalLight(b.getHex());if(!this.directionalLight)return!1;
a=(new THREE.Vector3).subVectors(this.cameraMove.eye,this.cameraMove.center);this.directionalLight.position.set(a.x,a.y,a.z);this.scene.add(this.directionalLight);return!0};JSM.ThreeViewer.prototype.SetRunBeforeRender=function(a){this.runBeforeRender=a};JSM.ThreeViewer.prototype.SetRunAfterRender=function(a){this.runAfterRender=a};JSM.ThreeViewer.prototype.SetClearColor=function(a){this.renderer.setClearColor(new THREE.Color(a));this.DrawIfNeeded()};
JSM.ThreeViewer.prototype.AddMesh=function(a){this.scene.add(a);this.DrawIfNeeded()};JSM.ThreeViewer.prototype.AddMeshes=function(a){var b;for(b=0;b<a.length;b++)this.scene.add(a[b]);this.DrawIfNeeded()};JSM.ThreeViewer.prototype.MeshCount=function(){var a=0;this.scene.traverse(function(b){if(b instanceof THREE.Mesh||b instanceof THREE.Line||b instanceof THREE.PointCloud)a+=1});return a};
JSM.ThreeViewer.prototype.VertexCount=function(){var a=0;this.scene.traverse(function(b){if(b instanceof THREE.Mesh||b instanceof THREE.Line||b instanceof THREE.PointCloud)a+=b.geometry.vertices.length});return a};JSM.ThreeViewer.prototype.FaceCount=function(){var a=0;this.scene.traverse(function(b){b instanceof THREE.Mesh&&(a+=b.geometry.faces.length)});return a};
JSM.ThreeViewer.prototype.GetMesh=function(a){var b=null,e=0,d;for(d=0;d<this.scene.children.length;d++)if(b=this.scene.children[d],b instanceof THREE.Mesh||b instanceof THREE.Line||b instanceof THREE.PointCloud){if(e==a)return b;e+=1}return null};JSM.ThreeViewer.prototype.RemoveMesh=function(a){a.geometry.dispose();this.scene.remove(a);this.DrawIfNeeded()};
JSM.ThreeViewer.prototype.RemoveMeshes=function(){var a,b;for(b=0;b<this.scene.children.length;b++)if(a=this.scene.children[b],a instanceof THREE.Mesh||a instanceof THREE.Line||a instanceof THREE.PointCloud)a.geometry.dispose(),this.scene.remove(a),b--;this.DrawIfNeeded()};JSM.ThreeViewer.prototype.RemoveLastMesh=function(){var a=null;this.scene.traverse(function(b){if(b instanceof THREE.Mesh||b instanceof THREE.Line||b instanceof THREE.PointCloud)a=b});null!==a&&this.scene.remove(a);this.DrawIfNeeded()};
JSM.ThreeViewer.prototype.SetCamera=function(a,b,e){this.navigation.SetCamera(a,b,e);this.navigation.SetOrbitCenter(b.Clone());this.DrawIfNeeded()};JSM.ThreeViewer.prototype.Resize=function(){this.camera.aspect=this.canvas.width/this.canvas.height;this.camera.updateProjectionMatrix();this.renderer.setSize(this.canvas.width,this.canvas.height);this.DrawIfNeeded()};
JSM.ThreeViewer.prototype.FitInWindow=function(){if(0!==this.MeshCount()){var a=this.GetBoundingSphere();this.navigation.FitInWindow(a.GetCenter(),a.GetRadius());this.DrawIfNeeded()}};JSM.ThreeViewer.prototype.AdjustClippingPlanes=function(a){this.GetBoundingSphere().GetRadius()<a?(this.camera.near=0.1,this.camera.far=1E3):(this.camera.near=10,this.camera.far=1E6);this.camera.updateProjectionMatrix();this.Draw()};JSM.ThreeViewer.prototype.GetCenter=function(){return this.GetBoundingBox().GetCenter()};
JSM.ThreeViewer.prototype.GetBoundingBox=function(){var a=new JSM.Coord(JSM.Inf,JSM.Inf,JSM.Inf),b=new JSM.Coord(-JSM.Inf,-JSM.Inf,-JSM.Inf),e,d;this.scene.traverse(function(f){if(f instanceof THREE.Mesh||f instanceof THREE.Line||f instanceof THREE.PointCloud){e=f.geometry;var c;for(c=0;c<e.vertices.length;c++)d=e.vertices[c].clone(),d.add(f.position),a.x=JSM.Minimum(a.x,d.x),a.y=JSM.Minimum(a.y,d.y),a.z=JSM.Minimum(a.z,d.z),b.x=JSM.Maximum(b.x,d.x),b.y=JSM.Maximum(b.y,d.y),b.z=JSM.Maximum(b.z,d.z)}});
return new JSM.Box(a,b)};JSM.ThreeViewer.prototype.GetBoundingSphere=function(){var a=this.GetCenter(),b=0,e,d,f;this.scene.traverse(function(c){if(c instanceof THREE.Mesh||c instanceof THREE.Line||c instanceof THREE.PointCloud){e=c.geometry;var g;for(g=0;g<e.vertices.length;g++)d=e.vertices[g].clone(),d.add(c.position),f=a.DistanceTo(new JSM.Coord(d.x,d.y,d.z)),JSM.IsGreater(f,b)&&(b=f)}});return new JSM.Sphere(a,b)};
JSM.ThreeViewer.prototype.GetObjectsUnderPosition=function(a,b){var e=2*(a/this.canvas.width)-1,d=2*-(b/this.canvas.height)+1,f=new THREE.Projector,c=this.camera.position,e=new THREE.Vector3(e,d,0.5);f.unprojectVector(e,this.camera);e.sub(c);e.normalize();return(new THREE.Raycaster(c,e)).intersectObjects(this.scene.children)};JSM.ThreeViewer.prototype.GetObjectsUnderMouse=function(){return this.GetObjectsUnderPosition(this.navigation.mouse.curr.x,this.navigation.mouse.curr.y)};
JSM.ThreeViewer.prototype.GetObjectsUnderTouch=function(){return this.GetObjectsUnderPosition(this.navigation.touch.curr.x,this.navigation.touch.curr.y)};JSM.ThreeViewer.prototype.ProjectVector=function(a,b,e){var d=this.canvas.width/2,f=this.canvas.height/2,c=new THREE.Projector;a=new THREE.Vector3(a,b,e);c.projectVector(a,this.camera);a.x=a.x*d+d;a.y=-(a.y*f)+f;return a};JSM.ThreeViewer.prototype.EnableDraw=function(a){this.enableDraw=a};
JSM.ThreeViewer.prototype.Draw=function(){if(this.enableDraw){null!==this.runBeforeRender&&this.runBeforeRender();this.camera.position.set(this.cameraMove.eye.x,this.cameraMove.eye.y,this.cameraMove.eye.z);this.camera.up.set(this.cameraMove.up.x,this.cameraMove.up.y,this.cameraMove.up.z);this.camera.lookAt(new THREE.Vector3(this.cameraMove.center.x,this.cameraMove.center.y,this.cameraMove.center.z));var a=(new THREE.Vector3).subVectors(this.cameraMove.eye,this.cameraMove.center);this.directionalLight.position.set(a.x,
a.y,a.z);this.renderer.render(this.scene,this.camera);null!==this.runAfterRender&&this.runAfterRender();this.drawLoop&&requestAnimationFrame(this.Draw.bind(this))}};JSM.ThreeViewer.prototype.DrawIfNeeded=function(){this.drawLoop||this.Draw()};JSM.ThreeViewer.prototype.StartDrawLoop=function(){this.drawLoop=!0;this.Draw()};

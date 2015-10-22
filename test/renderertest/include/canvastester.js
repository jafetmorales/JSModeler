CanvasTester = function (canvas, testFinishedCallback, allTestsFinishedCallback)
{
	this.canvas = canvas;
	this.testFinishedCallback = testFinishedCallback;
	this.allTestsFinishedCallback = allTestsFinishedCallback;
	this.allSuccess = true;
	this.currentTest = 0;
	this.tests = [];
};

CanvasTester.prototype.AddTest = function (renderCallback, referenceImage)
{
	this.tests.push ({
		renderCallback,
		referenceImage
	});
};

CanvasTester.prototype.Run = function ()
{
	this.currentTest = 0;
	this.RunCurrentTest ();
};

CanvasTester.prototype.ShowCurrentImage = function ()
{
	var dataURL = this.canvas.toDataURL ();
	window.open (dataURL, '_blank');
};

CanvasTester.prototype.RunCurrentTest = function ()
{
	if (this.currentTest >= this.tests.length) {
		this.allTestsFinishedCallback (this.allSuccess);
		return;
	}
	
	var test = this.tests[this.currentTest];
	test.renderCallback (this.RenderFinished.bind (this));
};

CanvasTester.prototype.RunNextTest = function ()
{
	this.currentTest += 1;
	setTimeout (this.RunCurrentTest.bind (this), 0);
};

CanvasTester.prototype.RenderFinished = function ()
{
	function GetImageData (image, width, height)
	{
		var canvas = document.createElement ('canvas');
		canvas.width = width;
		canvas.height = height;
		var context = canvas.getContext ('2d');
		context.drawImage (image, 0, 0, width, height);
		return context.getImageData (0, 0, width, height);		
	}
	
	var resultImageData = GetImageData (this.canvas, this.canvas.width, this.canvas.height)

	var myThis = this;
	var test = this.tests[this.currentTest];
	var referenceImage = new Image ();
	referenceImage.src = test.referenceImage;
	referenceImage.onload = function () {
		var referenceImageData = GetImageData (referenceImage, referenceImage.width, referenceImage.height);
		myThis.EvaluateResult (test.referenceImage, resultImageData, referenceImageData);
		myThis.RunNextTest ();
	};
	referenceImage.onerror = function () {
		var referenceImageData = null;
		myThis.EvaluateResult (test.referenceImage, resultImageData, referenceImageData);
		myThis.RunNextTest ();
	};
}

CanvasTester.prototype.EvaluateResult = function (referenceImageName, resultImageData, referenceImageData)
{
	function CreateImageData (width, height)
	{
		var canvas = document.createElement ('canvas');
		canvas.width = width;
		canvas.height = height;
		var context = canvas.getContext ('2d');
		return context.createImageData (width, height);			
	}
	
	var result = 0
	var differenceImageData = null;
	if (referenceImageData == null) {
		result = 1;
	} else {
		if (resultImageData.data.length != referenceImageData.data.length) {
			result = 2;
		} else {
			differenceImageData = CreateImageData (referenceImageData.width, referenceImageData.height);
			var i;
			for (i = 0; i < resultImageData.data.length; i += 4) {
				if (resultImageData.data[i + 0] == referenceImageData.data[i + 0] &&
					resultImageData.data[i + 1] == referenceImageData.data[i + 1] &&
					resultImageData.data[i + 2] == referenceImageData.data[i + 2] &&
					resultImageData.data[i + 3] == referenceImageData.data[i + 3])
				{
					differenceImageData.data[i + 0] = referenceImageData.data[i + 0];
					differenceImageData.data[i + 1] = referenceImageData.data[i + 1];
					differenceImageData.data[i + 2] = referenceImageData.data[i + 2];
					differenceImageData.data[i + 3] = 64;
					//break;
				} else {
					differenceImageData.data[i + 0] = 255;
					differenceImageData.data[i + 1] = 0;
					differenceImageData.data[i + 2] = 0;
					differenceImageData.data[i + 3] = 255;
					result = 3;
				}
			}
		}
	}
	if (result !== 0) {
		this.allSuccess = false;
	}
	this.testFinishedCallback (result, referenceImageName, resultImageData, referenceImageData, differenceImageData);
};

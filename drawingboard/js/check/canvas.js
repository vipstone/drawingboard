//变量声明
var mouseFrom = {},
  mouseTo = {},
  drawType = 'right', //画板绘制类型
  canvasObjectIndex = 0;
var drawWidth = 2; //笔触宽度
var modifySize = 20, modifySmallSize = 10; //大/小 | 对/错画笔直径大小
var color = "#E34F51"; //画笔颜色
var drawingObject = null; //当前绘制对象
var moveCount = 1; //绘制移动计数器
var doDrawing = false; // 绘制状态
var rightColor = "#008B00", wrongColor = "#E34F51";
// var modifyImg = null;//当前批改的图片
var appErrCount = 0;//全局错误个数
var errTextBoxArray = new Array();
var canvasArr = [];  //所有（fabric产生）的canvas对象


//切换画板
function switchCanvas(url, index) {
  var canvasId = "c" + index;
  jQuery("#canvasDiv").find("div").addClass("fn-hide");
  jQuery("#canvasDiv").find("div").eq(index).removeClass("fn-hide");
  if (canvasArr[index]) {
    //canvas已经存在
    window.canvas = canvasArr[index];
    return false;
  }
  var canvas = new fabric.Canvas(canvasId, {
    isDrawingMode: false,
    skipTargetFind: true,
    selectable: false,
    selection: false
  });
  fabric.Image.fromURL(url, function (img) {
    canvas.add(img);
  }, { crossOrigin: 'anonymous' });
  canvasArr[index] = canvas;
  canvas.freeDrawingBrush.color = color; //设置自由绘颜色
  canvas.freeDrawingBrush.width = drawWidth;
  window.canvas = canvas;

  //绑定画板事件
  canvas.on("mouse:down", function (options) {
    var xy = transformMouse(options.e.offsetX, options.e.offsetY);
    mouseFrom.x = xy.x;
    mouseFrom.y = xy.y;
    doDrawing = true;
  });
  canvas.on("mouse:up", function (options) {
    var xy = transformMouse(options.e.offsetX, options.e.offsetY);
    mouseTo.x = xy.x;
    mouseTo.y = xy.y;
    drawing();
    drawingObject = null;
    moveCount = 1;
    doDrawing = false;
    if (drawType.indexOf("wrong") != -1) {
      //有错题
      jQuery("#errModal").removeClass("fn-hide");
      jQuery("#errModal").find("div[name=etag]").removeClass("active");
      ++appErrCount;
      var addLeft = 10, addTop = 25;
      if (drawType == "wrong") {
        addLeft = 25;
        addTop = 30;
      }
      var textbox = new fabric.Textbox(appErrCount.toString(), {
        left: mouseFrom.x + addLeft,
        top: mouseFrom.y - addTop,
        fontSize: 18,
        borderColor: "#2c2c2c",
        fill: color,
        hasControls: false,
        eindex: (appErrCount - 1),
        type: "textbox"
      });
      canvas.add(textbox);
      errTextBoxArray[appErrCount] = textbox;
    }
  });
  canvas.on("mouse:move", function (options) {
    if (moveCount % 2 && !doDrawing) {
      //减少绘制频率
      return;
    }
    moveCount++;
    var xy = transformMouse(options.e.offsetX, options.e.offsetY);
    mouseTo.x = xy.x;
    mouseTo.y = xy.y;
    drawing();
  });
  canvas.on("selection:created", function (e) {
    if (e.target._objects) {
      //多选删除
      var etCount = e.target._objects.length;
      for (var etindex = 0; etindex < etCount; etindex++) {
        if (e.target._objects[etindex].type == "image" || e.target._objects[etindex].type == "textbox") {
          continue;
        }
        var eindex = e.target._objects[etindex].eindex;
        canvas.remove(errTextBoxArray[(1 + eindex)]); //移除对应右上角的数字
        delete errTextBoxArray[(1 + eindex)];

        canvas.remove(e.target._objects[etindex]);

        //移除作业批注
        var errMsgChildren = jQuery("#errMsg").children();
        errMsgChildren.eq(errMsgChildren.length - 1 - eindex).addClass("fn-hide");
      }
    } else {
      //单选删除
      if (e.target.type != "image" && e.target.type != "textbox") {
        var eindex = e.target.eindex;
        canvas.remove(errTextBoxArray[(1 + eindex)]); //移除对应右上角的数字
        delete errTextBoxArray[(1 + eindex)];
        canvas.remove(e.target);

        //移除作业批注
        var errMsgChildren = jQuery("#errMsg").children();
        errMsgChildren.eq(errMsgChildren.length - 1 - eindex).addClass("fn-hide");

      }
    }
    canvas.discardActiveObject(); //清楚选中框
  });


}

window.zoom = window.zoom ? window.zoom : 1;
// window.drawType = drawType;

//坐标转换
function transformMouse(mouseX, mouseY) {
  return { x: mouseX / window.zoom, y: mouseY / window.zoom };
}

//绘画方法
function drawing() {
  if (drawingObject) {
    canvas.remove(drawingObject);
  }
  var canvasObject = null;
  switch (drawType) {
    case 'right': //整题正确
      var path =
        "M " +
        (mouseFrom.x - modifySize) +
        " " +
        (mouseFrom.y - modifySize) +
        " L " +
        mouseFrom.x +
        " " +
        mouseFrom.y +
        " L " +
        (mouseFrom.x + modifySize * 2) +
        " " +
        (mouseFrom.y - modifySize * 2);
      canvasObject = new fabric.Path(path, {
        stroke: rightColor,
        strokeWidth: drawWidth,
        fill: "rgba(255, 255, 255, 0)"
      });
      break;
    case 'wrong': //整题错误
      var path =
        "M " +
        (mouseFrom.x - modifySize) +
        " " +
        (mouseFrom.y - modifySize) +
        " L " +
        (mouseFrom.x + modifySize) +
        " " +
        (mouseFrom.y + modifySize) +
        "M " +
        (mouseFrom.x + modifySize) +
        " " +
        (mouseFrom.y - modifySize) +
        " L " +
        (mouseFrom.x - modifySize) +
        " " +
        (mouseFrom.y + modifySize);
      canvasObject = new fabric.Path(path, {
        stroke: wrongColor,
        strokeWidth: drawWidth,
        eindex: appErrCount,
        fill: "rgba(255, 255, 255, 0)"
      });

      // canvas.add();
      break;
    case 'smallright': //题目内单个正确
      var path =
        "M " +
        (mouseFrom.x - modifySmallSize) +
        " " +
        (mouseFrom.y - modifySmallSize) +
        " L " +
        mouseFrom.x +
        " " +
        mouseFrom.y +
        " L " +
        (mouseFrom.x + modifySmallSize * 2) +
        " " +
        (mouseFrom.y - modifySmallSize * 2);
      canvasObject = new fabric.Path(path, {
        stroke: rightColor,
        strokeWidth: drawWidth,
        fill: "rgba(255, 255, 255, 0)"
      });
      break;
    case 'smallwrong': //题目内单个错误
      var path =
        "M " +
        (mouseFrom.x - modifySmallSize) +
        " " +
        (mouseFrom.y - modifySmallSize) +
        " L " +
        (mouseFrom.x + modifySmallSize) +
        " " +
        (mouseFrom.y + modifySmallSize) +
        "M " +
        (mouseFrom.x + modifySmallSize) +
        " " +
        (mouseFrom.y - modifySmallSize) +
        " L " +
        (mouseFrom.x - modifySmallSize) +
        " " +
        (mouseFrom.y + modifySmallSize);
      canvasObject = new fabric.Path(path, {
        stroke: wrongColor,
        strokeWidth: drawWidth,
        eindex: appErrCount,
        fill: "rgba(255, 255, 255, 0)"
      });
      break;
    case "rectangle": //圈题
      canvasObject = new fabric.Rect({
        top: mouseFrom.y,
        left: mouseFrom.x,
        width: (mouseTo.x - mouseFrom.x),
        height: (mouseTo.y - mouseFrom.y),
        stroke: color,
        strokeWidth: drawWidth,
        fill: "rgba(255, 255, 255, 0)"
      });
      break;
    case "remove":
      break;
    case "help":

      break;
    default:

      break;
  }
  if (canvasObject) {
    // canvasObject.index = getCanvasObjectIndex();
    canvasObject.type = drawType;
    canvas.add(canvasObject); //.setActiveObject(canvasObject)
    drawingObject = canvasObject;
  }
}

//获取画板对象的下标
function getCanvasObjectIndex() {
  return canvasObjectIndex++;
}

(function () {
  //变量声明
  var mouseFrom = {},
    mouseTo = {},
    drawType = 'right', //画板绘制类型
    canvasObjectIndex = 0,
    textbox = null;
  var drawWidth = 2; //笔触宽度
  var color = "#E34F51"; //画笔颜色
  var drawingObject = null; //当前绘制对象
  var moveCount = 1; //绘制移动计数器
  var doDrawing = false; // 绘制状态
  var rightColor = "#006400", wrongColor = "#E34F51";

  //初始化画板
  var canvas = new fabric.Canvas("c", {
    isDrawingMode: false,
    skipTargetFind: true,
    selectable: false,
    selection: false
  });

  fabric.Image.fromURL('http://icdn.apigo.cn/paper.png?1', function (img) {
    canvas.add(img);
  }, { crossOrigin: 'anonymous' });

  window.canvas = canvas;
  window.zoom = window.zoom ? window.zoom : 1;
  window.drawType = drawType;

  canvas.freeDrawingBrush.color = color; //设置自由绘颜色
  canvas.freeDrawingBrush.width = drawWidth;

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
        if (e.target._objects[etindex].type == "image") {
          continue;
        }
        canvas.remove(e.target._objects[etindex]);
      }
    } else {
      //单选删除
      if (e.target.type != "image") {
        canvas.remove(e.target);
      }
    }
    canvas.discardActiveObject(); //清楚选中框
  });

  //坐标转换
  function transformMouse(mouseX, mouseY) {
    return { x: mouseX / window.zoom, y: mouseY / window.zoom };
  }

  //绑定工具事件
  jQuery("#toolsul")
    .find("li")
    .on("click", function () {
      //设置样式
      jQuery("#toolsul")
        .find("li>i")
        .each(function () {
          jQuery(this).attr("class", jQuery(this).attr("data-default"));
        });
      jQuery(this)
        .addClass("active")
        .siblings()
        .removeClass("active");
      jQuery(this)
        .find("i")
        .attr(
          "class",
          jQuery(this)
            .find("i")
            .attr("class")
            .replace("black", "select")
        );
      drawType = jQuery(this).attr("data-type");
      window.drawType = drawType;
      canvas.isDrawingMode = false;
      if (textbox) {
        //退出文本编辑状态
        textbox.exitEditing();
        textbox = null;
      }
      if (drawType == "pen") {
        canvas.isDrawingMode = true;
      } else if (drawType == "remove") {
        canvas.selection = true;
        canvas.skipTargetFind = false;
        canvas.selectable = true;
      } else {
        canvas.skipTargetFind = true; //画板元素不能被选中
        canvas.selection = false; //画板不显示选中
      }
    });

  //绘画方法
  function drawing() {
    if (drawingObject) {
      canvas.remove(drawingObject);
    }
    var canvasObject = null;
    switch (drawType) {
      case "arrow": //箭头
        canvasObject = new fabric.Path(drawArrow(mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y, 30, 30), {
          stroke: color,
          fill: "rgba(255,255,255,0)",
          strokeWidth: drawWidth
        });
        break;
      case "line": //直线
        canvasObject = new fabric.Line([mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y], {
          stroke: color,
          strokeWidth: drawWidth
        });
        break;
      case "dottedline": //虚线
        canvasObject = new fabric.Line([mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y], {
          strokeDashArray: [3, 1],
          stroke: color,
          strokeWidth: drawWidth
        });
        break;
      case "text":
        textbox = new fabric.Textbox("", {
          left: mouseFrom.x - 60,
          top: mouseFrom.y - 20,
          width: 150,
          fontSize: 18,
          borderColor: "#2c2c2c",
          fill: color,
          hasControls: false
        });
        canvas.add(textbox);
        textbox.enterEditing();
        textbox.hiddenTextarea.focus();
        break;
      case 'right': //整题正确
        var step = 30;
        var path =
          "M " +
          (mouseFrom.x - step) +
          " " +
          (mouseFrom.y - step) +
          " L " +
          mouseFrom.x +
          " " +
          mouseFrom.y +
          " L " +
          (mouseFrom.x + step * 2) +
          " " +
          (mouseFrom.y - step * 2);
        canvasObject = new fabric.Path(path, {
          stroke: rightColor,
          strokeWidth: drawWidth,
          fill: "rgba(255, 255, 255, 0)"
        });
        break;
      case 'wrong': //整题错误
        var step = 30;
        var path =
          "M " +
          (mouseFrom.x - step) +
          " " +
          (mouseFrom.y - step) +
          " L " +
          (mouseFrom.x + step) +
          " " +
          (mouseFrom.y + step) +
          "M " +
          (mouseFrom.x + step) +
          " " +
          (mouseFrom.y - step) +
          " L " +
          (mouseFrom.x - step) +
          " " +
          (mouseFrom.y + step);
        canvasObject = new fabric.Path(path, {
          stroke: wrongColor,
          strokeWidth: drawWidth,
          fill: "rgba(255, 255, 255, 0)"
        });
        break;
      case 'smallright': //题目内单个正确
        var step = 10;
        var path =
          "M " +
          (mouseFrom.x - step) +
          " " +
          (mouseFrom.y - step) +
          " L " +
          mouseFrom.x +
          " " +
          mouseFrom.y +
          " L " +
          (mouseFrom.x + step * 2) +
          " " +
          (mouseFrom.y - step * 2);
        canvasObject = new fabric.Path(path, {
          stroke: rightColor,
          strokeWidth: drawWidth,
          fill: "rgba(255, 255, 255, 0)"
        });
        break;
      case 'smallwrong': //题目内单个错误
        var step = 10;
        var path =
          "M " +
          (mouseFrom.x - step) +
          " " +
          (mouseFrom.y - step) +
          " L " +
          (mouseFrom.x + step) +
          " " +
          (mouseFrom.y + step) +
          "M " +
          (mouseFrom.x + step) +
          " " +
          (mouseFrom.y - step) +
          " L " +
          (mouseFrom.x - step) +
          " " +
          (mouseFrom.y + step);
        canvasObject = new fabric.Path(path, {
          stroke: wrongColor,
          strokeWidth: drawWidth,
          fill: "rgba(255, 255, 255, 0)"
        });
        break;
      case "remove":
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

  //绘制箭头方法
  function drawArrow(fromX, fromY, toX, toY, theta, headlen) {
    theta = typeof theta != "undefined" ? theta : 30;
    headlen = typeof theta != "undefined" ? headlen : 10;
    // 计算各角度和对应的P2,P3坐标
    var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
      angle1 = (angle + theta) * Math.PI / 180,
      angle2 = (angle - theta) * Math.PI / 180,
      topX = headlen * Math.cos(angle1),
      topY = headlen * Math.sin(angle1),
      botX = headlen * Math.cos(angle2),
      botY = headlen * Math.sin(angle2);
    var arrowX = fromX - topX,
      arrowY = fromY - topY;
    var path = " M " + fromX + " " + fromY;
    path += " L " + toX + " " + toY;
    arrowX = toX + topX;
    arrowY = toY + topY;
    path += " M " + arrowX + " " + arrowY;
    path += " L " + toX + " " + toY;
    arrowX = toX + botX;
    arrowY = toY + botY;
    path += " L " + arrowX + " " + arrowY;
    return path;
  }

  //获取画板对象的下标
  function getCanvasObjectIndex() {
    return canvasObjectIndex++;
  }
})();

(function () {
    //变量声明
    var mouseFrom = {}, mouseTo = {}, drawType = null, canvasObjectIndex = 0;

    //初始化画板
    var canvas = new fabric.Canvas('c', {
        isDrawingMode: true, skipTargetFind: true, selectable: false, selection: false
    });
    canvas.freeDrawingBrush.color = "#E34F51"; //设置画笔颜色

    //绑定画板事件
    canvas.on("mouse:down", function (options) {
        mouseFrom.x = options.e.clientX;
        mouseFrom.y = options.e.clientY;
    });

    canvas.on("mouse:up", function (options) {
        mouseTo.x = options.e.clientX;
        mouseTo.y = options.e.clientY;
        drawing();
    });

    //绑定工具事件
    jQuery("#toolsul").find("li").on("click", function () {
        //设置样式
        jQuery("#toolsul").find("li>i").each(
            function () {
                jQuery(this).attr("class", jQuery(this).attr("data-default"));
            }
        );
        jQuery(this).addClass("active").siblings().removeClass("active");
        jQuery(this).find("i").attr("class", jQuery(this).find("i").attr("class").replace("black", "select"));
        drawType = jQuery(this).attr("data-type");
        if (drawType == "pen") {
            canvas.isDrawingMode = true;
        } else {
            canvas.isDrawingMode = false;
        }
    });

    //绘画方法
    function drawing() {
        var canvasObject = null;
        switch (drawType) {
            case "arrow":

                break;
            case "line": //直线
                canvasObject = new fabric.Line([mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y], {
                    stroke: canvas.freeDrawingBrush.color,
                });
                break;
            case "dottedline": //虚线
                canvasObject = new fabric.Line([mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y], {
                    strokeDashArray: [3, 1],
                    stroke: canvas.freeDrawingBrush.color,
                });
                break;
            case "circle":

                break;
            case "ellipse":

                break;
            case "square":

                break;
            case "rectangle":

                break;
            case "rightangle":

                break;
            case "equilateral":

                break;
            case "isosceles":

                break;
            case "text":

                break;
            case "remove":

                break;
            default:
                break;
        }
        if (canvasObject) {
            canvasObject.index = getCanvasObjectIndex();
            canvas.add(canvasObject);
        }
    }

    //获取画板对象的下标
    function getCanvasObjectIndex() {
        return canvasObjectIndex++;
    }

})();
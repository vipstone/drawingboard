## 使用笔记 ##

### 常用属性 ###
canvas.isDrawingMode = true; 可以自由绘制<br>
canvas.selectable = false; 控件不能被选择，不会被操作<br>
canvas.selection = true; 画板显示选中<br>
canvas.skipTargetFind = true; 整个画板元素不能被选中<br>
canvas.freeDrawingBrush.color = "#E34F51" 设置自由绘画笔的颜色<br>
freeDrawingBrush.width  自由绘笔触宽度<br>

----------

### 方法 ###
add(object) 添加<br>
insertAt(object,index) 添加<br>
remove(object) 移除<br>
forEachObject 循环遍历 ?<br>
getObjects() 获取所有对象<br>
item(int) 获取子项<br>
isEmpty() 判断是否空画板<br>
size() 画板元素个数<br>
contains(object) 查询是否包含某个元素<br>
fabric.util.cos<br>
fabric.util.sin<br>
fabric.util.drawDashedLine  绘制虚线<br>
getWidth()? setWidth()<br>
getHeight()?<br>
clear() 清空<br>
renderAll() 重绘<br>
requestRenderAll() 请求重新渲染?<br>
rendercanvas() 重绘画板?<br>
getCenter().top/left 获取中心坐标?<br>
toDatalessJSON() 画板信息序列化成最小的json?<br>
toJSON() 画板信息序列化成json<br>
moveTo(object,index) 移动?<br>
dispose() 释放?<br>
setCursor() 设置手势图标?<br>
getSelectionContext()获取选中的context?<br>
getSelectionElement()获取选中的元素<br>
getActiveObject() 获取选中的对象<br>
getActiveObjects() 获取选中的多个对象<br>
discardActiveObject()取消当前选中对象? <br>
isType() 图片的类型?<br>
setColor(color) = canvas.set("full","");?<br>
rotate() 设置旋转角度<br>
setCoords() 设置坐标?<br>

----------

### 事件 ###
object:added<br>
object:removed<br>
object:modified<br>
object:rotating<br>
object:scaling<br>
object:moving<br>
object:selected 这个方法v2已经废弃，使用selection:created替代，多选不会触发<br>
before:selection:cleared<br>
selection:cleared<br>
selection:updated<br>
selection:created<br>
path:created<br>
mouse:down<br>
mouse:move<br>
mouse:up<br>
mouse:over<br>
mouse:out<br>
mouse:dblclick<br>

----------

### IText的方法 ###
selectAll() 选择全部<br>
getSelectedText() 获取选中的文本<br>
exitEditing() 退出编辑模式?<br>


----------

### 绘制直线 ###
var line = new fabric.Line([10, 10, 100, 100], {<br>
  fill: 'green',<br>
  stroke: 'green',	//笔触颜色<br>
  strokeWidth: 2,//笔触宽度<br>
});<br>
canvas.add(line);<br>

----------

### 绘制虚线 ###
在绘制直线的基础上添加属性strokeDashArray:Array<br>
example：<br>
var line = new fabric.Line([10, 10, 100, 100], {<br>
  fill: 'green',<br>
  stroke: 'green',<br>
  strokeDashArray:[3,1] <br>
});<br>
canvas.add(line);<br>

strokeDashArray[a,b] =》 每隔a个像素空b个像素。<br>



----------

### 可绘制对象 ###
fabric.Circle	圆<br>
fabric.Ellipse	椭圆<br>
fabric.Line 直线<br>
fabric.Polygon<br>
fabric.Polyline<br>
fabric.Rect 矩形<br>
fabric.Triangle 三角形<br>

----------

### 图片去掉选中边框和旋转，且只能移动，不可操作 ###
oImg.hasControls = false; 只能移动不能（编辑）操作<br>
oImg.hasBorders = false; 去掉边框，可以正常操作<br>
hasRotatingPoint = false; 不能被旋转<br>
hasRotatingPoint 控制旋转点不可见<br>

demo：
fabric.Image.fromURL("300.jpg", function (oImg) {<br>
&nbsp;&nbsp;canvas.add(oImg);<br>
&nbsp;&nbsp;oImg.hasControls = oImg.hasBorders = false;<br>
});

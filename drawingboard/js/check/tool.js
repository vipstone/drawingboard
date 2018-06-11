var HTTP = {
    encodeHTML: function(text) {
        var temp = document.createElement("div");
        (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
        var output = temp.innerHTML;
        temp = null;
        var s = "";
        if (output.length == 0) return "";
        s = output.replace(/&/g, "&amp;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        return s;
    },
    decodeHTML: function(text) {
        var s = "";
        if (text.length == 0) return "";
        s = text.replace(/&amp;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");

        var temp = document.createElement("div");
        temp.innerHTML = s;
        var output = temp.innerText || temp.textContent;
        temp = null;

        return s;
    },
    checkURL: function(URL) {
        var str = URL;
        //判断URL地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
        //下面的代码中应用了转义字符"\"输出一个字符"/"
        var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
        var objExp = new RegExp(Expression);
        if (objExp.test(str) == true) {
            return true;
        } else {
            return false;
        }
    },
    http_ajax: function(data) {
        var _data = data || {};
        var success = _data.success;
        _data.login = _data.login === false ? false : true;
        _data.dataType = "json";
        _data.xhrFields = { withCredentials: true };
        _data.crossDomain = true;
        _data.success = function(ret) {
          if (ret.code == 200) {
            success && success(ret);
          } else {
            HELP_TOOL.useMessage(ret.desc);
          }
        }
        if (_data.login) {
          _data.error = function(err) {
            if (JSON.parse(err.responseText).code == 401) {
              location.href = '../index.html';
            }
          }
        }
        $.ajax(_data);
    }
}

var HELP_TOOL = {
    checkMail: function(mail) {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (filter.test(mail)) return true;
        else {
            return false;
        }
    },
    checkNum: function(num) {
        var filter = /^(0|[1-9][0-9]*)$/;
        if (filter.test(num)) return true;
        else {
            return false;
        }
    },
    checkPhone: function(phone) {
        return phone.length == 11 ? true : false;
    },
    isEmpty: function (value) {
        return (value == "" || value == undefined || value == null || value == 0 || JSON.stringify(value) == "{}")
    },
    showMessage: function(desc) {
      $('#point_message').text(desc).show().delay(2000).fadeOut(1000);
    },
    createMessage: function(desc, cls) {
      var msg = document.createElement('div');
      msg.id = 'point_message';
      msg.className = cls;
      msg.innerText = desc;
      document.body.appendChild(msg);
      $(msg).delay(2000).fadeOut(1000);
    },
    useMessage: function(desc, cls) {
      $('#point_message').length == 0 ? this.createMessage(desc, cls) : this.showMessage(desc);
    },
    getParam: function(key) {
      var param = location.search.substr(1);
      var obj = {};
      param = param.split('&');
      param.forEach(function(e) {
        obj[e.split('=')[0]] = e.split('=')[1];
      })
      return obj[key];
    },
    createConfirm: function(options) {
      var _options = options || {};
      var modal = document.createElement('div');
      var box = document.createElement('div');
      modal.id = 'confirm_modal';
      box.id = 'confirm_box';
      var confBtn = document.createElement('div');
      var closeBtn = document.createElement('div');
      var text = document.createElement('div');
      confBtn.id = 'confirm_btn';
      closeBtn.id = 'close_btn';
      text.id = 'confirm_text';
      confBtn.innerText = _options.confText;
      closeBtn.innerText = _options.closeText;
      text.innerText = _options.text;
      confBtn.onclick = function() {
        $('#confirm_modal').addClass('fn-hide');
        _options.confirm();
      }
      closeBtn.onclick = function() {
        $('#confirm_modal').addClass('fn-hide');
        _options.close && _options.close();
      }
      box.appendChild(confBtn);
      box.appendChild(closeBtn);
      box.appendChild(text);
      modal.appendChild(box);
      document.body.appendChild(modal);
    },
    showConfirm: function(options) {
      var _options = options || {};
      document.querySelector('#confirm_btn').innerText = _options.confText;
      document.querySelector('#close_btn').innerText = _options.closeText;
      document.querySelector('#confirm_text').innerText = _options.text;
      document.querySelector('#confirm_btn').onclick = function() {
        $('#confirm_modal').addClass('fn-hide');
        _options.confirm();
      }
      document.querySelector('#close_btn').onclick = function() {
        $('#confirm_modal').addClass('fn-hide');
        _options.close && _options.close();
      }
      $('#confirm_modal').removeClass('fn-hide');
    },
    useConfirm: function(options) {
      $('#confirm_modal').length == 0 ? this.createConfirm(options) : this.showConfirm(options);
    }
}

var debugFlag = true;

var SERVER_ARR = ["http://172.16.11.148", "http://third.172.16.11.49.xip.io/"];

var SOCKET = "ws://172.16.11.49:9502";

var SERVER1 = debugFlag ? SERVER_ARR[1] : "http://api.yousi.com/";
var SERVER2 = debugFlag ? SERVER_ARR[1] : "http://api.yousi.com/";

var HTTP_URL = {
    login: SERVER1 + "/wq.php/publiclib/login", //登录
    pickSchoolRoom: SERVER1 + '/wq.php/task/pickSchoolRoom', //选择教室
    quitSchoolRoom: SERVER1 + '/wq.php/task/quitSchoolRoom', //退出教室
    checkLogin: SERVER1 + '/wq.php/publiclib/checkLoginStatus', //检测登陆
    assistantGetTasks: SERVER1 + '/wq.php/task/assistantTasks', //助教获取主作业(task)列表
    assistantGetTaskLists: SERVER1 + '/wq.php/task/assistantTaskLists', //助教获取作业单(task_list)列表
    getTaskInfo: SERVER1 + '/wq.php/task/taskInfo', //获取主作业信息，包含作业单列表
    improveTaskList: SERVER1 + '/wq.php/task/improveTaskList', //更新作业单(task_list)信息
    changeTask: SERVER1 + '/wq.php/task/changeTask', //改变主作业(task)状态,
    signTaskList: SERVER1 + '/wq.php/task/signTaskList', //给task_list的图片做标注（批改/复核）
    judgeTaskList: SERVER1 + '/wq.php/task/judgeTaskList', //提交task_list的评分
    changeTaskList: SERVER1 + '/wq.php/task/changeTaskList', //改变作业单(task_list)状态
    callStudent: SERVER1 + '/wq.php/task/callStudent', //(助教)呼叫学生
    assistantTaskCompleted: SERVER1 + '/wq.php/task/assistantTaskCompleted', //助教获取自己完成的任务
    assistantGetTaskError: SERVER1 + '/wq.php/task/assistantTaskError', //助教获取自己标记的异常
    schoolRoomList: SERVER1 + '/wq.php/schoolroom/schoolRoomList', //获取教室列表
    loginout: SERVER1 + '/wq.php/Publiclib/loginout', //退出登陆
    throwStudent: SERVER1 + '/wq.php/task/throwStudent', //助教赶走学生
    getTaskListInfo: SERVER1 + '/wq.php/task/assistantTaskListInfo', //分任务详情
    getTaskErrorInfo: SERVER1 + '/wq.php/task/assistantTaskErrorInfo', //异常任务详情
}

//rivets模块
rivets.formatters.eq = function(value, args) {
    return value == args;
}

rivets.formatters.neq = function(value, args) {
    return value !== args;
}

rivets.formatters.gt = function(value, arg) {
    return value > arg;
}

rivets.formatters.gte = function(value, arg) {
    return value >= arg;
}

rivets.formatters.lt = function(value, arg) {
    return value < arg;
}

rivets.formatters.lte = function(value, arg) {
    return value <= arg;
}

rivets.formatters.inRange = function(value, args) {
    var range = args.split(",")
    if (range.length == 2) {
        if (value > range[0] && value < range[1]) {
            return true
        }
    }
    return false
}

rivets.formatters.getElemtByIndex = function(value, arg) {
    if ((value.length - 1) < arg) {
        return "0"
    } else {
        return value[arg]
    }
}

rivets.formatters.empty = function(value, arg) {
    if (value == "" || value == undefined || value == NaN || value.length == 0 || value == null || value == 0 || value == "0" || JSON.stringify(value) == "{}") {
        return true
    } else {
        return false
    }
}

rivets.formatters.emptyZero = function(value, arg) {
    if (value == "" || value == undefined || value == NaN || value.length == 0 || value == null || value == 0 || value == "0" || JSON.stringify(value) == "{}") {
        return 0
    } else {
        return value
    }
}

rivets.formatters.emptyValue = function(value, arg) {
    if (value == "" || value == undefined || value == NaN || value.length == 0 || value == null || value == 0 || value == "0" || JSON.stringify(value) == "{}") {
        return "暂无"
    } else {
        return value
    }
}

rivets.formatters.in = function(value, args) {
    var array = null
    if (args.indexOf(",") > -1) {
        array = args.split(",")
    } else {
        array = args
    }
    if (array.indexOf(value) > -1) {
        return true
    }
    return false
}

rivets.formatters.decodeHtml = function(value) {
    return value ? HTTP.decodeHTML(value) : ""
}

rivets.binders.imgurll = function(el, value) {
    setTimeout(function(){
      if (value) {
          el.src = value
      } else {
          var defaulturl = el.getAttribute("default-url");
          el.src = value || defaulturl;
      }
    },0)
}

rivets.formatters.defaulturl = function(value,arg){
  if(arg==1){
    return value = value + "_nan.png";
  }else if (arg==2) {
    return value = value + "_nv.png";
  }else {
    return value = value + ".jpg";
  }
}

rivets.formatters.contain = function(value, arg) {
    if (value instanceof Array) {
        function contains(arr, obj) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === obj) {
                    return true;
                }
            }
            return false;
        }
        return contains(value, arg)
    } else if (typeof(value) == "string") {
        return arg.indexOf(value) == -1
    } else {
        return false
    }
}

rivets.formatters.arrLength = function(value) {
    if (value && value.length) {
        return value.length
    }else {
      return 0;
    }
}
rivets.formatters.tofixednum = function(value,arg) {
    if (value) {
        return (value*1).toFixed(arg)
    }else {
      return value;
    }
}
rivets.formatters.textSubstring = function(value, arg) {
    if (value.length > 0){
        if (typeof arg == "number") {
            if (value.length > arg) {
                return value = value.substring(0, arg)+ "...";//
            } else {
                return value = value.substring(0, arg);
            }
        }else if (typeof arg == "string") {
            var start = arg.split(" ")[0];
            var end   = arg.split(" ")[1];
            return value = value.substring(start, end);
        } else  {
            return value;
        }

    } else {
        return value;

    }
}
rivets.formatters.lengthIsOne = function(value) {
    if(value.length === 1){
      return true;
    }else{
      return false;
    }
}
rivets.formatters.telHref = function(value,arg){
    if(value){
      return value = arg + value;
    }else {
      return value
    }
}
rivets.formatters.comparison = function(value,arg){
  if(value && typeof arg == "string"){
    var argArr = arg.split(":");
    for (var i = 0; i < argArr.length; i++) {
      if(value == argArr[i]){
        value = true;
      }
    }
    if(value === true){
      return  value ;
    }else {
      return value = false;
    }
  }
}

rivets.formatters.filtermoney = function(value,arg){
    if(value){
        return value*1
    }else {
        return 0
    }
}

rivets.formatters.moneyValue = function(value,arg){
    return (parseFloat(value) /100).toFixed(1)
}

var Log = {
    i: function(obj) {
        console.log(JSON.stringify(obj))
    },
    e: function(obj) {
        console.error(JSON.stringify(obj))
    }
}

//图片上传 (uploadImageArray = [{"name":"xxx","base64":"xxx"}])
function uploadImg(uploadImageArray, qiniuToken) {
    if (uploadImageArray && uploadImageArray.length > 0 && qiniuToken) {
        //上传，返回地址
        var putExtra = {
            fname: "",
            params: {},
            mimeType: [] || null
        };
        var config = {
            useCdnDomain: true
        };
        window.WinSuccCount = 0;
        window.WinUploadImgCount = uploadImageArray.length;
        for (var i = 0; i < uploadImageArray.length; i++) {
            doUpload(uploadImageArray[i].name, uploadImageArray[i].base64.replace('data:image/png;base64,', ''), qiniuToken);
        }
    }
}

//图片上传七牛云
function doUpload(name, base64, qiniuToken) {
    //图片上传（base64模式直传）
    var urlkey = toBase64(name); //自定义文件名必须是base64格式的
    var url = "http://upload.qiniup.com/putb64/-1/key/" + urlkey; //非华东空间需要根据注意事项-修改上传域名(upload.qiniup.com)
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            //返回信息
            console.log(xhr.responseText);

            //检测是否上传完毕，提交请求给服务器
            ++window.WinSuccCount;
            if (window.WinUploadImgCount == window.WinSuccCount) {
                reqCheckServer();
                window.WinSuccCount = 0;
                window.WinUploadImgCount = 0;
            }
        }
    }
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.setRequestHeader("Authorization", "UpToken " + qiniuToken);
    xhr.send(base64);
}

//提交作业批改（php）
function reqCheckServer() {
    if (window.checkJson) {
        // prompt("最终结果", window.checkJson);
        jQuery.ajax({
            type: "POST",
            url: config.checkURL,
            data: { "param": window.checkJson },
            success: function (res) {
                location.href = config.callbackURL;
                console.log(res);
            }
        });
        jQuery("#maskDiv").hide();
    }
}

function toBase64(data) {
    var toBase64Table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var base64Pad = '=';
    var result = '';
    var length = data.length;
    var i;
    for (i = 0; i < (length - 2); i += 3) {
        result += toBase64Table[data.charCodeAt(i) >> 2];
        result += toBase64Table[((data.charCodeAt(i) & 0x03) << 4) + (data.charCodeAt(i + 1) >> 4)];
        result += toBase64Table[((data.charCodeAt(i + 1) & 0x0f) << 2) + (data.charCodeAt(i + 2) >> 6)];
        result += toBase64Table[data.charCodeAt(i + 2) & 0x3f];
    }
    if (length % 3) {
        i = length - (length % 3);
        result += toBase64Table[data.charCodeAt(i) >> 2];
        if ((length % 3) == 2) {
            result += toBase64Table[((data.charCodeAt(i) & 0x03) << 4) + (data.charCodeAt(i + 1) >> 4)];
            result += toBase64Table[(data.charCodeAt(i + 1) & 0x0f) << 2];
            result += base64Pad;
        } else {
            result += toBase64Table[(data.charCodeAt(i) & 0x03) << 4];
            result += base64Pad + base64Pad;
        }
    }
    return result;
}

//base64转blob
function base64ToBlob(base64, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    var byteCharacters = atob(base64);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}
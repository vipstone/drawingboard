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

        for (var i = 1; i < uploadImageArray.length; i++) {
            // // base64 转 blob 模式上传
            // var contentType = 'image/png';
            // var blob = base64ToBlob(uploadImageArray[i].base64.replace('data:image/png;base64,', ''), contentType, undefined);

            // var observable = qiniu.upload(blob, uploadImageArray[i].name, qiniuToken, putExtra, config);
            // var subscription = observable.subscribe({
            //     next(res) {
            //         // console.log(res);
            //     },
            //     error(err) {
            //         console.log(err);
            //     },
            //     complete(res) {
            //         console.log(res);
            //     }
            // });

            //base64模式直接上传
            var urlkey = toBase64(uploadImageArray[i].name); //自定义文件名必须是base64格式的
            var url = "http://upload.qiniup.com/putb64/-1/key/" + urlkey; //非华东空间需要根据注意事项-修改上传域名(upload.qiniup.com)
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    //返回信息
                    console.log(xhr.responseText);
                }
            }
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/octet-stream");
            xhr.setRequestHeader("Authorization", "UpToken " + qiniuToken);
            xhr.send(uploadImageArray[i].base64.replace('data:image/png;base64,', ''));
        }
    }
}

var toBase64Table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var base64Pad = '=';
function toBase64(data) {
    var result = '';
    var length = data.length;
    var i;
    // Convert every three bytes to 4 ascii characters.                                                   

    for (i = 0; i < (length - 2); i += 3) {
        result += toBase64Table[data.charCodeAt(i) >> 2];
        result += toBase64Table[((data.charCodeAt(i) & 0x03) << 4) + (data.charCodeAt(i + 1) >> 4)];
        result += toBase64Table[((data.charCodeAt(i + 1) & 0x0f) << 2) + (data.charCodeAt(i + 2) >> 6)];
        result += toBase64Table[data.charCodeAt(i + 2) & 0x3f];
    }

    // Convert the remaining 1 or 2 bytes, pad out to 4 characters.     
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
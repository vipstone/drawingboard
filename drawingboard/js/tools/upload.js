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

            var contentType = 'image/png';
            var blob = base64ToBlob(uploadImageArray[i].base64.replace('data:image/png;base64,', ''), contentType, undefined);

            var observable = qiniu.upload(blob, uploadImageArray[i].name, qiniuToken, putExtra, config);
            var subscription = observable.subscribe({
                next(res) {
                    // console.log(res);
                },
                error(err) {
                    console.log(err);
                },
                complete(res) {
                    console.log(res);
                }
            });
        }
    }
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
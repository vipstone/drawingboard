/**
 * 注意：这不是真正的GUID，无法在Javascript中生成真正的GUID，因为它们依赖于浏览器不公开的本地计算机的属性。
 * 可以配合时间戳：md5(uuid.uuid() + new Date().getTime())重复性更小
 */
(function(){var _uuid={uuid:function(){var s=[];var hexDigits="0123456789abcdef";for(var i=0;i<36;i++){s[i]=hexDigits.substr(Math.floor(Math.random()*16),1)}s[14]="4";s[19]=hexDigits.substr((s[19]&3)|8,1);s[8]=s[13]=s[18]=s[23]="-";var uuid=s.join("");return uuid}};this.uuid=_uuid})();

const common = require("../core/common");
const constant = common.constant;
var base = require(common.pathes.pathLayout + "layout_base")

class LayoutLogin extends base {
    constructor() {
        super();
    }

    Generate(fileName) {
        let content = `<div id='login'>
    <div class="text-center mb-4">
        <h1 class="h3 mb-3 font-weight-normal">Login</h1>
        <p id="msg">Build form controls with floating labels via the <code>:placeholder-shown</code> pseudo-element. <a href="https://caniuse.com/#feat=css-placeholder-shown">Works in latest Chrome, Safari, and Firefox.</a></p>
    </div>

    <input type="email" name="account" id="inputAccount" class="form-control" placeholder="Email address" required autofocus>
    <br>
    <input type="password" name="password" id="inputPassword" class="form-control" placeholder="Password" required>
    <br>
    <button class="btn btn-lg btn-primary btn-block" type="submit" id="submit" onclick='post()'>Sign in</button>

    <script src="/lib/custom/login.js" defer></script>
    <script src="/lib/md5/md5.min.js" defer></script>
</div>`
        return this.GenerateHtml(null, this.GenerateHtmlBody(null, this.GenerateBodyMiddle("", content, null, "container top-offset-70"), null, null));
    }
};

module.exports = LayoutLogin;
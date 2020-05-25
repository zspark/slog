const common = require("../core/common");
const constant = common.constant;
var base = require(common.pathes.pathLayout + "layout_base")

class LayoutEditor extends base {
    constructor() {
        super();
    }

    _GenerateModalAlert(){
return `<div class="modal fade" id="alertModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Alert</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p id="alertContent"></p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="btn-continue">Continue</button>
            </div>
        </div>
    </div>
</div>`;
    }

    _GenerateModalProperty(title, author, categoryName, allowHistory) {
return `<div class="modal fade" id="propertyModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Property</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                ${this._GenerateInput("title", "inputTitle", title)}
                ${this._GenerateInput("author", "inputAuthor", author)}
                ${this._GenerateInput("category", "inputCategory", categoryName)}

                <label for="message-text" class="col-form-label">layout:</label>
                <div class="input-group">
                    <select class="custom-select" id="slcTemplate" aria-label="Example select with button addon">
                        <option value="1">default</option>
                        <option value="2">default_no_title</option>
                        <option value="3">fullscreen</option>
                        <option value="4">fullscreen_no_title</option>
                    </select>
                </div>

                ${this._GenerateCheckbox("allow history","cbAllowHistory",allowHistory)}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="btn-save">Save</button>
            </div>
        </div>
    </div>
</div>`;
    }


    Generate(content, title, author, categoryName, allowHistory, templateOptions) {
        let middleMiddle = `<div class="row--1">
    <div class="col--2">
        <textarea id="markdown" form="myform" name="content">${content}</textarea>
    </div>
    <div class="col--2">
        <div id="div-preview">
        </div>
    </div>
</div>`;
        let middleBottom = this._GenerateModalAlert();
        middleBottom += this._GenerateModalProperty(title, author, categoryName, allowHistory);

        let head = this.GenerateHtmlHead(`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/codemirror.min.css">
<style>
    .CodeMirror {
    border: 1px solid #eee;
    height: auto;
    font-size: 0.9em;
  }
</style>`);
        let bodyTop = `<div class="bg-dark fixed-top">
    <button type="button" id="Delete" onclick="Delete()" class="btn btn-danger btn-sm">Delete</button>
    <button type="button" id="Cancel" onclick="Cancel()" class="btn btn-primary btn-sm">Cancel</button> 
    <button type="button" id="Save" onclick="Save()" class="btn btn-secondary btn-sm">Save</button> 
    <button type="button" id="SaveAndExit" onclick="SaveAndExit()" class="btn btn-secondary btn-sm">SaveAndExit</button> 
    <button type="button" id="Property" onclick="Property()" class="btn btn-primary btn-sm">Property ...</button>
</div>`;

        let bodyScript = this.GenerateBodyScript(`<script src="/lib/custom/editor.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/marked/0.8.1/marked.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/codemirror.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/mode/markdown/markdown.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/addon/selection/active-line.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/keymap/vim.min.js" defer></script>`);
        return this.GenerateHtml(head, this.GenerateHtmlBody(bodyTop, this.GenerateBodyMiddle("", middleMiddle, middleBottom, "top-offset-32"), null, bodyScript));
    }
};

module.exports = LayoutEditor;
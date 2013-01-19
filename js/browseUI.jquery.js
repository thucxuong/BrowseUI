//This plugin must provided:
//a base classname
//a label for browse button by adding "data-title" attribute or "title" attribute for the input file. And this plugin prefered data-title

(function( $ ){

  $.fn.browseUI = function(options) {

    var defaults = {
        //All the extra tag will base on the className provided here
        className: "CustomBrowseUI",
        editableText:  false,
        availExt: ["gif","jpg","png"],
        errorTag: "", //This is the selector for targetting the error message position. Eg: "#error-mess"
        errorText: "<p>Add the right extension you brain numb.</p>" //Text for error. If there is no errorTag, the text will be added after the upload btn. If there is, it'll be appened in the errorTag
    };

    var _this = this,
    options = $.extend(defaults, options),
    groupSet = _this.selector.split(",");

    
    //make 2 fake inputs: text and button.
    //text input: .CustomBrowseUIText
    //button input: .CustomBrowseUIBtn
    //make an extra fakeform to reset the input incase

    _this.reset = function(){
        jQuery(this).each(function(){
            this.reset();
        });
    }

    var BrowseBtnObj = function (inputFile){
        var $this = jQuery(inputFile);
        
        if($this.hasClass("Initialized"))
            return;
        
        var fakeBtn = '<input id="'+inputFile.id+'-btn" class="CustomBrowseUIBtn" type="button" value=',
            realBrowseBtnLbl = jQuery(inputFile).attr("data-title"),
            fakeText,
            fakeForm;

        //Get the label for the browse button. This is incase of translation text.
        if(realBrowseBtnLbl!=undefined)
            fakeBtn += '"' + realBrowseBtnLbl+'" />';
        else if(inputFile.title.length!=0)
            fakeBtn += '"' + inputFile.title+'" />';
        else
            fakeBtn += '"Choose..." />';

        //Init fake button and fake file name.
        fakeBtn = jQuery(fakeBtn);
        fakeText = jQuery('<input />',{
            "id": inputFile.id+"-text",
            "class":"CustomBrowseUIText",
            "type":"text"
        });

        if(jQuery("#"+options.className+"Form").length==0)
            fakeForm = jQuery("<form id='"+options.className+"Form'></form>").appendTo("body");
        else
            fakeForm = jQuery("#"+options.className+"Form");
        !options.editableText && fakeText.attr("readonly","readonly");

        //Hide the original browse and give a classname to know it's initialized
        $this.addClass("Initialized").css({"position":"absolute", "top":"-5000px", "left": "-5000px", "width":1, "height":1}).after(fakeBtn).after(fakeText);

        //This method help the input file reset when someone try to choose the wrong file type or reset the form.
        inputFile.reset = function(){
            jQuery(this).detach().appendTo("#"+options.className+"Form");
            console.log(fakeForm);
            fakeForm.get(0).reset();
            fakeText.before(jQuery(this));
            fakeText.val("").removeClass("error");
            jQuery("#"+this.id+'-error-message').remove();
        }

        //Transit the event from real input to the fake one
        $this.bind("change.browseUI",function(){
            var getExt = this.value.substr(this.value.lastIndexOf(".")+1);
            getExt = getExt.toLowerCase();
            for(var i=0; i< options.availExt.length; i++)
                if(options.availExt[i]==getExt)
                {
                    fakeText.val(this.value).removeClass("error");
                    jQuery("#"+this.id+'-error-message').remove();
                    return;
                }
            this.reset();
            if(options.errorText!="" && !fakeText.hasClass("error"))
            {
                var errorText = jQuery(options.errorText).attr("id",this.id+'-error-message');
                if(options.errorTag!="")
                    jQuery(options.errorTag).append(errorText);
                else 
                    fakeBtn.parent().append(errorText);
            }

            fakeText.addClass("error");
        }).focus("focus.browseUI",function(){
            fakeBtn.focus();
        });

        //Call input file browse file action
        fakeBtn.bind("click.browseUI",function(){
            $this.click();
        });
    }


    _this.each(function() {
        //Return if it's already init
        new BrowseBtnObj(this);
    });
    
    // Bind the reset moethod of custom form into native form element
    for(var i=0; i<groupSet.length; i++)
    {
        var formSelArr = groupSet[i].split(" ");
        while(formSelArr.length && formSelArr[formSelArr.length-1].indexOf("form")!=0){
            formSelArr.pop();
        };
        if(formSelArr.length)
        {
            formSelArr.join(" ");
            jQuery(formSelArr[0]).each(function(){
                if(jQuery(this).find("."+options.className).length)
                {
                    jQuery(this).bind("reset.file", function(){
                        _this.reset();
                    });
                }
            });
        }
    }

    return _this;

  };
})( jQuery );

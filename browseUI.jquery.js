//This plugin must provided:
//a base classname
//a label for browse button by adding "data-title" attribute or "title" attribute for the input file. And this plugin prefered data-title

(function( $ ){

  $.fn.browseUI = function(options) {

  var defaults = {
        //All the extra tag will base on the className provided here
		className: "CustomBrowseUI"
	};

	var options = $.extend(defaults, options)
        _this = jQuery(this);

    //make 2 fake inputs: text and button.
    //text input: .CustomBrowseUIText
    //button input: .CustomBrowseUIBtn

    this.each(function() {
        //Return if it's already init
        if(_this.hasClass("Initialized"))
            return;
        var fakeBtn = '<input class="CustomBrowseUIBtn" type="button" value=',
            realBrowseBtnLbl = jQuery(this).attr("data-title"),
            fakeText;

        //Get the label for the browse button. This is incase of translation text.
        if(realBrowseBtnLbl!=undefined)
            fakeBtn += '"' + realBrowseBtnLbl+'" />';
        else if(this.title.length!=0)
            fakeBtn += '"' + this.title+'" />';
        else
            fakeBtn += '"Choose..." />';

        //Init fake button and fake file name.
        fakeBtn = jQuery(fakeBtn);
        fakeText = jQuery('<input class="CustomBrowseUIText" type="text" readonly="readonly" />');

        //Hide the original browse and give a classname to know it's initialized
        _this.addClass("Initialized").css({"position":"absolute", "top":"-5000px", "left": "-5000px", "width":1, "height":1}).parent().append(fakeText).append(fakeBtn);

        //Transit the event from real input to the fake one
        _this.bind("change.browseUI",function(){
            fakeText.val(this.value);
        }).focus("focus.browseUI",function(){
            fakeBtn.focus();
        });

        //Call input file browse file action
        fakeBtn.bind("click.browseUI",function(){
            _this.click();
        });

    });

  };
})( jQuery );

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html src="http://code.jquery.com/jquery-1.7.js">

<head>
<title>jQuery calling RESTful Services</title>
<meta xmlns="http://www.w3.org/1999/xhtml" content="text/html; charset=utf-8" />
<style http-equiv="Content-Type">
body {
    font-family: "Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif;
    font-size: 12px;
}
p, h1, form, button {
    border: 0;
    margin: 0;
    padding: 0;
}
.spacer {
    clear: both;
    height: 1px;
}
.myform 
{
   
    margin: 0 auto;
    width: 400px;
    padding: 14px;
}
#stylized 
{
   
    border: solid 2px #b7ddf2;
    background: #ebf4fb;
}
#stylized h1 {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 8px;
}
#stylized p {
    font-size: 11px;
    color: #666666;
    margin-bottom: 20px;
    border-bottom: solid 1px #b7ddf2;
    padding-bottom: 10px;
}
#stylized label {
    display: block;
    font-weight: bold;
    text-align: right;
    width: 140px;
    float: left;
}
#stylized .small {
    color: #666666;
    display: block;
    font-size: 11px;
    font-weight: normal;
    text-align: right;
    width: 140px;
}
#stylized input, select {
    float: left;
    font-size: 12px;
    padding: 4px 2px;
    border: solid 1px #aacfe4;
    width: 200px;
    margin: 2px 0 20px 10px;
}
#stylized button {
    clear: both;
    margin-left: 150px;
    width: 246px;
    height: 31px;
    background: #666666 url(img/button.png) no-repeat;
    text-align: center;
    line-height: 31px;
    color: #FFFFFF;
    font-size: 11px;
    font-weight: bold;
}
</style>
</head>

<body>

<!--<script type="text/javascript" 
            name="cboFastBikes"></script>
<script name="cboFastBikes">
    $(document).ready(function () {

        $('#butCallAjax').click(function () {
            jQuery.support.cors = true;


            $.ajax(
                {
                    type: "GET",
                    url:                      'http://localhost:8080/Taphius_Module/service/listSourcer/',
                            data: "{}",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {

                        //alert('success');
                        $.each(data, function (i, theItem) {
                            var combo = document.getElementById("cboFastBikes");
                            var option = document.createElement("option");
                            option.text = theItem.toString();
                            option.value = theItem.toString();
                            try {
                                //alert('success add combo');
                                combo.add(option, null); // Other browsers
                            }
                            catch (error) {
                                alert('error found');
                                combo.add(option); // really old browser
                            }

                        });
                    },
                    error: function (msg, url, line) {
                        alert('error trapped in error: function(msg, url, line)');
                        alert('msg = ' + msg + ', url = ' + url + ', line = ' + line);

                    }
                });


            //alert('button click');

        });
    });
</script>-->


<div id = "stylized" class = "myform">
    
        <form action="http://localhost:8080/Taphius_Module/service/listSourcer/addSourcer" method="post">
    <input type="submit" value="View All Sourcer" 
         name="Submit" id="frm1_submit" />
</form>
    
</div>


</body>

</html>

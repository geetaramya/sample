$(document).ready(function(){
	$('.delete').click(function(){
		//alert("clicked");
	var id=$(this).val();
	// alert("hi");
	$.post("/remove",{no:id},function(data){
		location.reload('/');

	});
	});
	$('.edit').click(function(){
		var id=$(this).val();
		//alert(id);
		$.post("/edit",{no:id},function(data){
		 alert(data);
		var a=JSON.stringify(data);
		//alert(a);
		 var parseddata=JSON.parse(a);
		alert(parseddata[0].firstname);
		$("#id").val(parseddata[0]._id);
		$("#firstname").val(parseddata[0].firstname);
		$("#lastname").val(parseddata[0].lastname);
		$("#number").val(parseddata[0].number);
		$("#email").val(parseddata[0].email);
		});
		$(".dontshow").show();
	});	
});
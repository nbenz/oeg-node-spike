$('.form-toggle li').click(function(){
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    $('#' + $(this).data('content') ).siblings().hide();
    $('#' + $(this).data('content') ).show();
  }
);

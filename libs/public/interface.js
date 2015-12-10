$('.form-toggle li').click(function(){
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    $('title').text($(this).data('title') );
    $('#' + $(this).data('content') ).siblings().hide();
    $('#' + $(this).data('content') ).show();
  }
);

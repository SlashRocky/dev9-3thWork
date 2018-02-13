/* ----------------------------------------
グローバル変数宣言
---------------------------------------- */
//imageオブジェクトを格納する配列imageList
var imageList = [];

//imageオブジェクトがいくつあるのかを表す変数countNum
var countNum;

//配列imageListの何番目のimageオブジェクトなのかを表す変数num(０スタート)
var num;

var storageKey = 0;

/* ----------------------------------------
 関数定義
---------------------------------------- */
// ローカルストレージに保存する
var saveToLS = function(){
  
  //配列memoListを文字列memoStrに変換
  var imageStr = JSON.stringify(imageList);

  //ローカルストレージのKey"image"にvalue"imageStr"をセッティング
  window.localStorage.setItem('image',imageStr);
  
  //ローカルストレージからimageを取ってきて、変数lsに代入
  ls = window.localStorage.getItem('image');
  
  //それをパースする
  imgList = JSON.parse(ls);
  
  //今保存したimageの配列的な数が知りたい（０スタートなので−１する）
  storageKey = imgList.length -1 ;
  console.log(storageKey);
};

/* ----------------------------------------
 DOMが読み込まれたら
---------------------------------------- */
$(function(){
	
  /* ----------------------------------------
  セレクトボックスのオプションを表示
  ---------------------------------------- */
  //ローカルストレージに保存されているkey"image"（文字列情報）を変数imageStrに格納
  var imageStr = window.localStorage.getItem('image');

  //ローカルストレージに一つでも情報が格納されている場合
  if(imageStr !== null){

    //文字列imageStrを配列imageListに変換
    imageList = JSON.parse(imageStr);
  }
	
  //imageオブジェクトの個数だけfor文で回す

  for(var i = 0; i < imageList.length; i++){

    //i番目のimageオブジェクトのプロパティを変数に格納
    var title = imageList[i].title;
    var imgSrc = imageList[i].imgSrc;

    //タグ追加
    $('<option class="image-title" value="'+i+'"><span class="titel-text">'+ title +'</span></option>').appendTo('.output-title');
  }
	
  
  
  /* ----------------------------------------
  お絵かきのおまじない
  ---------------------------------------- */
  const can = $('#canvas')[0];
  const ctx = can.getContext('2d');



  /* ----------------------------------------
  変数定義
  ---------------------------------------- */
  //終了点のx座標とY座標を代入する変数
  let x,y;

  //開始点のX,Y座様を代入する変数
  let oldX,oldY;

  //マウスが押されてるか押されてないかを判定する変数
  let flag = false;

  //一つ前に戻る用の変数定義
  let undoImage;



  /* ----------------------------------------
  マウスが押されている時
  ---------------------------------------- */
  $(can).on('mousedown',function(e){

    //開始点のX座標をゲット
    oldX = e.offsetX;

    //開始点のY座標をゲット
    oldY = e.offsetY;

    //今はマウスがダウンしている時なんだよ！
    flag = true;

    //新たに描く前の状態をゲット
    undoImage = ctx.getImageData(0,0,can.width,can.height);

  });



  /* ----------------------------------------
  マウスアップした時
  ---------------------------------------- */
  $(can).on('mouseup',function(){
    flag = false;
  });



  /* ----------------------------------------
  マウスがcanvasから外れた時
  ---------------------------------------- */
  $(can).on('mouseout',function(){
    flag = false;
  });



  /* ----------------------------------------
  マウスが動いている時	
  ---------------------------------------- */
  $(can).on('mousemove',function(e){

    if(flag == true){

      x = e.offsetX;
      y = e.offsetY;

      //描くよーっていう合図
      ctx.beginPath();
      //開始点
      ctx.moveTo(oldX,oldY);
      //終了点
      ctx.lineTo(x,y);
      //開始命令
      ctx.stroke();
      //終了命令
      ctx.closePath();

      //終了点と開始点の情報を入れ替える
      oldX = x;
      oldY = y;
    }

  });



  /* ----------------------------------------
  色
  ---------------------------------------- */
  $('#color').on('change',function(){

    let color = $('#color').val();
    ctx.strokeStyle = color;

  });



  /* ----------------------------------------
  太さ
  ---------------------------------------- */
  $('#range').on('change',function(){

    let range = $('#range').val();
    ctx.lineWidth = range;
    $('.range').text(range);
    ctx.lineCap = 'round';

  });



  /* ----------------------------------------
  ペン
  ---------------------------------------- */
  $('#pen').on('click',function(){

    let color = $('#color').val();
    ctx.strokeStyle = color;

    let range = $('#range').val();
    ctx.lineWidth = range;
    ctx.lineCap = 'round';
    $('.range').text(range);

  });



  /* ----------------------------------------
  消しゴム
  ---------------------------------------- */
  $('#erase').on('click',function(){

    let color = '#f2f2f2';
    ctx.strokeStyle = color;
    let range = '50';
    ctx.lineWidth = range;
    $('.range').text(range);

  });



  /* ----------------------------------------
  戻る
  ---------------------------------------- */
  $('#undo-btn').on('click',function(e){
    ctx.putImageData(undoImage,0,0);
  });



  /* ----------------------------------------
  消去
  ---------------------------------------- */
  $('#clear-btn').on('click',function(e){

    //インプットペインの描かれているのもを消去
    e.preventDefault();
    ctx.clearRect(0,0,can.width,can.height);

    //タイトル欄を空欄に
    $('.input-title').val('');

  });



  /* ----------------------------------------
  保存
  ---------------------------------------- */
  $('#save-btn').on('click',function(){

    //1.タイトル取得
    var title = $('.input-title').val();
    console.log(title);

    //2.絵取得
    //既にid=canvasに描かれている要素を取得
    var canvas = $('#canvas')[0];
    //描画内容をデータURIに変換（png）
    var imgSrc = canvas.toDataURL('image/png');

    //ひとかたまりのimageデータをオブジェクト"image"に格納
    var image = {
        title : title,
        imgSrc : imgSrc
    }

    //"image"を配列imageListの末尾に追加
    imageList.push(image);

    //更新された配列imageListをローカルストレージに保存
    saveToLS();

    //セレクトボックスにタイトルを追加　storageKeyは一番新しく追加したimageのキー
    $('.output-title').append('<option class="image-title" value="'+storageKey+'"><span class="titel-text">'+ title +'</span></option>');
 
    //タイトル欄にタイトル入力
    $('.output-title').val(storageKey);

    //描画
    $('#myImage').attr('src',imgSrc);

  });

  /* ----------------------------------------
  タイトルが選択されたら
  ---------------------------------------- */
  $('#output-title').on('change', function(){

    num = $('[name=output-title]').val();
    
    //配列imageListの中から該当するimageオブジェクトを取得し、変数imageに格納
    var image = imageList[num];
    
    //当該imageオブジェクトのプロパティのパラメーターを変数に格納
    var title = image.title;
    var imgSrc = image.imgSrc;

    //output-imageに出力
    $('#myImage').attr('src',imgSrc);

  });

});



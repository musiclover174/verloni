;(function() {
  
  // news block
  let newsEx = {
    toNextHref: null, // или ссылка
    toPrevHref: null,
    newsTitle: '',
    newsDate: '',
    newsPrevText: '',
    newsText: ''
  }
  
  function setNewsContent() {
    const toNextEl = $('.news__tonext'),
          toPrevEl = $('.news__toprev')
    
    if (newsEx.toNextHref) {
      toNextEl
        .removeClass('disabled')
        .attr('href', newsEx.toNextHref)
    } else {
      toNextEl
        .addClass('disabled')
        .attr('href', '')
    }
    
    if (newsEx.toPrevHref) {
      toPrevEl
        .removeClass('disabled')
        .attr('href', newsEx.toPrevHref)
    } else {
      toPrevEl
        .addClass('disabled')
        .attr('href', '')
    }
    
    $('.news__inner-title').text(newsEx.newsTitle)
    $('.news__inner-date').text(newsEx.newsDate)
    $('.news__inner-prevtext').text(newsEx.newsPrevText)
    $('.news__inner-text').html(newsEx.newsText)
  }
  
  function getNewsByUrl(url) {
    $.ajax({
      url: ''
    }).done(function (data) {
      // newsEx = data
      newsEx = {
        toNextHref: null, // или ссылка
        toPrevHref: '#newHrefToPrev',
        newsTitle: 'Скидка 20% на весь ассортимент продукции Verloni',
        newsDate: '26.02.2018',
        newsPrevText: 'Только до конца октября проводится акция на продукцию компании Verloni. Скидка на весь ассортимент Verloni – 20%.',
        newsText: `<img src="img/news-inner.jpg">
                  <p>Особенность бакелитовой ручки в том, что она не нагревается и не скользит, обеспечивая удобный хват. Выдерживает нагрев до 150°С. Можно использовать в духовке до 180°С или даже до 200°С. Выдерживает нагрев до 150°С. Можно использовать в духовке до 180°С или даже до 200°С. Особенность бакелитовой ручки в том, что она не нагревается и не скользит, обеспечивая удобный хват. </p>
                  <p>Именно они создают ощущение настоящего гостеприимного дома, вкусного, уютного, куда хочется возвращаться. Они придают неповторимый шарм рабочему месту хозяйки, создают настроение праздника и подчеркивают ее индивидуальность. </p>
                  <p>Итальянцы как никто разбираются в кухне и домашнем уюте. Поэтому такие мысли приходили к нему каждый раз, когда он садился за работу, и на его эскизах все чаще появлялись невероятные по красоте кухонные принадлежности.</p>`
      }
      setNewsContent()
    })
  }
  
  $('html').on('click', '.js-news-open, .news__tonext, .news__toprev', function(){
    const href = $(this).attr('href')

    getNewsByUrl(href)
    $('html').addClass('newsopen')

    return false
  })
  
  $('.news__close').click(function(){
    $('html').removeClass('newsopen')
    return false
  })
  
})()
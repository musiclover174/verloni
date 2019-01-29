(function () {

  window.xs = window.innerWidth <= 1024 ? true : false

  window.mobile = window.innerWidth <= 480 ? true : false

  window.xsHeight = window.innerHeight <= 540 ? true : false

  window.touch = document.querySelector('html').classList.contains('touchevents')

  window.animation = {}

  window.animation.fadeIn = (elem, ms, cb, d = 'block') => {
    if (!elem)
      return;

    elem.style.opacity = 0;
    elem.style.display = d;

    if (ms) {
      var opacity = 0;
      var timer = setInterval(function () {
        opacity += 50 / ms;
        if (opacity >= 1) {
          clearInterval(timer);
          opacity = 1;
          if (cb) cb()
        }
        elem.style.opacity = opacity;
      }, 50);
    } else {
      elem.style.opacity = 1;
      if (cb) cb()
    }
  }

  window.animation.fadeOut = (elem, ms, cb) => {
    if (!elem)
      return;

    elem.style.opacity = 1;

    if (ms) {
      var opacity = 1;
      var timer = setInterval(function () {
        opacity -= 50 / ms;
        if (opacity <= 0) {
          clearInterval(timer);
          opacity = 0;
          elem.style.display = "none";
          if (cb) cb()
        }
        elem.style.opacity = opacity;
      }, 50);
    } else {
      elem.style.opacity = 0;
      elem.style.display = "none";
      if (cb) cb()
    }
  }

  window.animation.scrollTo = (to, duration) => {
    if (duration <= 0) return;
    const element = document.documentElement,
      difference = to - element.scrollTop,
      perTick = difference / duration * 10;

    setTimeout(function () {
      element.scrollTop = element.scrollTop + perTick;
      window.animation.scrollTo(to, duration - 10);
    }, 10);
  }

  window.animation.visChecker = (el) => {
    let rect = el.getBoundingClientRect()
    return (
      //rect.top >= 0 &&
      //rect.left >= 0 &&
      rect.bottom - el.offsetHeight * .35 <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  window.verloni = {}

  window.verloni.form = ({

    init: function () {

      const _th = this,
        inputs = document.querySelectorAll('.common__input, .common__textarea'),
        forms = document.querySelectorAll('form'),
        selectors = document.querySelectorAll('.js-select'),
        choicesArr = [],
        digitsInput = document.querySelectorAll('.js-digits')

      $('.js-phone').mask('+7(999) 999-9999')

      function emptyCheck(event) {
        event.target.value.trim() === '' ?
          event.target.classList.remove('notempty') :
          event.target.classList.add('notempty')
      }
      
      for (let item of inputs) {
        item.addEventListener('keyup', emptyCheck)
        item.addEventListener('blur', emptyCheck)
      }

      if (document.querySelectorAll('.js-common-file').length) {
        let commonFile = document.querySelectorAll('.js-common-fileinput'),
          commonFileDelete = document.querySelectorAll('.js-common-filedelete')

        for (let fileInp of commonFile) {
          fileInp.addEventListener('change', (e) => {
            let el = fileInp.nextElementSibling,
              path = fileInp.value.split('\\'),
              pathName = path[path.length - 1].split('');

            pathName.length >= 30 ?
              pathName = pathName.slice(0, 28).join('') + '...' :
              pathName = pathName.join('')

            el.textContent = pathName;
            el.classList.add('choosed');
          })
        }

        for (let fileDelete of commonFileDelete) {
          fileDelete.addEventListener('click', (e) => {
            let el = fileDelete.previousElementSibling,
              fileInput = fileDelete.previousElementSibling.previousElementSibling;
            el.textContent = el.getAttribute('data-default');
            fileInput.value = '';
            el.classList.remove('choosed');
          })
        }
      }

      for (let form of forms) {
        form.addEventListener('submit', e => !_th.checkForm(form) && e.preventDefault() && e.stopPropagation())
      }

      for (let selector of selectors) {
        let choice = new Choices(selector, {
          searchEnabled: false,
          itemSelectText: '',
          position: 'bottom'
        });
        choicesArr.push(choice);
      }

      for (let digitInput of digitsInput) {
        digitInput.addEventListener('keydown', (e) => {
          let validArr = [46, 8, 9, 27, 13, 110, 190]
          if (validArr.indexOf(e.keyCode) !== -1 ||
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
          }
          if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault()
          }
        });
      }

      return this
    },

    checkForm: function (form) {
      let checkResult = true;
      const warningElems = form.querySelectorAll('.warning');

      if (warningElems.length) {
        for (let warningElem of warningElems) {
          warningElem.classList.remove('warning')
        }
      }

      for (let elem of form.querySelectorAll('input, textarea, select')) {
        if (elem.getAttribute('data-req')) {
          switch (elem.getAttribute('data-type')) {
            case 'tel':
              var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
              if (!re.test(elem.value)) {
                elem.classList.add('warning')
                checkResult = false
              }
              break;
            case 'email':
              var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
              if (!re.test(elem.value)) {
                elem.classList.add('warning')
                checkResult = false
              }
              break;
            case 'file':
              if (elem.value.trim() === '') {
                elem.parentNode.classList.add('warning')
                checkResult = false
              }
              break;
            default:
              if (elem.value.trim() === '') {
                elem.classList.add('warning')
                checkResult = false
              }
              break;
          }
        }
      }
      
      for (let item of form.querySelectorAll('input[name^=agreement]')) {
        if (!item.checked) {
          item.classList.add('warning')
          checkResult = false
        }
      }
      return checkResult
    }

  }).init()

  window.verloni.obj = ({

    indexBannerCarousel: () => {
      const bannerSwiper = new Swiper('.js-ibanner', {
        loop: false,
        speed: 800,
        slidesPerView: 1,
        spaceBetween: 0,
        parallax: true,
        navigation: {
          nextEl: '.js-ibanner ~ .swiper-buttons .swiper-button-next',
          prevEl: '.js-ibanner ~ .swiper-buttons .swiper-button-prev',
        },
        autoplay: {
          delay: 5000
        }
      })
    },
    
    indexGalleryCarousel: () => {
      const gallerySwiper = new Swiper('.js-igal', {
        loop: true,
        loopedSlides: 4,
        centeredSlides: true,
        speed: 800,
        slidesPerView: 'auto',
        spaceBetween: window.innerWidth <= 960 ? -1 : 0,
        navigation: {
          nextEl: '.js-igal .swiper-button-next',
          prevEl: '.js-igal .swiper-button-prev',
        }
      })
    },
    
    indexDishes: () => {
      let step = 1
      
      const spacers = document.querySelectorAll('.js-dishes-spacer'),
            positioner = document.querySelector('.js-dishes-positioner'),
            dishesOver = document.querySelector('.js-dishes'),
            positionHeight = parseInt(getComputedStyle(positioner)['height']) * 1
      
      for (let spacer of spacers) {
        spacer.style.height = positionHeight + 'px'
      }
      
      window.addEventListener('scroll', () => {
        const dishesRect = dishesOver.getBoundingClientRect(),
              posRect = positioner.getBoundingClientRect(),
              wHeightHalf = (window.innerHeight || document.documentElement.clientHeight) / 2,
              positionHeightHalf = positioner.offsetHeight / 2
        
        if (dishesRect.top + positionHeightHalf <= wHeightHalf) {
          if (dishesRect.top + dishesOver.offsetHeight - positionHeightHalf - wHeightHalf > 0) { 
            positioner.classList.remove('bottom')
            positioner.classList.add('fixed')
            //positioner.style.top = Math.abs(dishesRect.top + positionHeightHalf - wHeightHalf) + 'px'
          }
          else {
            positioner.classList.remove('fixed')
            positioner.classList.add('bottom')
          }
        } else {
          positioner.classList.remove('fixed', 'bottom')
          positioner.removeAttribute('style')
        }
      })
      
      const controller = new ScrollMagic.Controller()

      // dishes scenes
      const sceneDish1 = new ScrollMagic.Scene({
        triggerElement: '.js-dishes-spacer[data-step="1"]',
        duration: positionHeight
      }).setTween('.iabout__dishes-dish[data-step="1"]', 1, {top: '-208px', ease: Linear.easeNone})
      
      const sceneDish2 = new ScrollMagic.Scene({
        triggerElement: '.js-dishes-spacer[data-step="2"]',
        duration: positionHeight
      }).setTween('.iabout__dishes-dish[data-step="2"]', 1, {top: '0px', opacity: '1', ease: Linear.easeNone})
      
      const timelineDish3 = new TimelineMax()
      const sceneDish3 = new ScrollMagic.Scene({
        triggerElement: '.js-dishes-spacer[data-step="3"]',
        duration: positionHeight * .7
      })
      timelineDish3.add([
        TweenMax.to('.iabout__dishes-dish[data-step="1"]', 1, {top: "-290px", ease: Linear.easeNone}),
        TweenMax.to('.iabout__dishes-dish[data-step="2"]', 1, {top: "-68px", ease: Linear.easeNone}),
        TweenMax.to('.iabout__dishes-dish[data-step="3"]', 1, {top: '91px', opacity: '1', ease: Linear.easeNone})
      ])
      sceneDish3.setTween(timelineDish3)
      
      // features scenes
      const timelineFeat1 = new TimelineMax()
      const sceneFeat1 = new ScrollMagic.Scene({
        triggerElement: '.js-dishes-spacer[data-step="1"]',
        duration: positionHeight * .25,
        offset: positionHeight * .75
      })
      timelineFeat1.add([
        TweenMax.to('.iabout__verloni-value[data-step="1"]', 1, {opacity: 0, right: '20px', ease: Linear.easeNone}),
        TweenMax.to('.iabout__text-type[data-step="1"]', 1, {opacity: 0, left: '-20px', display: 'none', ease: Linear.easeNone})
      ])
      sceneFeat1.setTween(timelineFeat1)
      
      const timelineFeat2 = new TimelineMax()
      const sceneFeat2 = new ScrollMagic.Scene({
        triggerElement: '.js-dishes-spacer[data-step="2"]',
        duration: positionHeight * .25
      })
      timelineFeat2.add([
        TweenMax.to('.iabout__verloni-value[data-step="2"]', 1, {opacity: 1, right: '0px', ease: Linear.easeNone}),
        TweenMax.to('.iabout__text-type[data-step="2"]', 1, {opacity: 1, left: '0px', display: 'block', ease: Linear.easeNone})
      ])
      sceneFeat2.setTween(timelineFeat2)
      
      const timelineFeat2Fade = new TimelineMax()
      const sceneFeat2Fade = new ScrollMagic.Scene({
        triggerElement: '.js-dishes-spacer[data-step="2"]',
        duration: positionHeight * .25,
        offset: positionHeight * .75
      })
      timelineFeat2Fade.add([
        TweenMax.to('.iabout__verloni-value[data-step="2"]', 1, {opacity: 0, right: '20px', ease: Linear.easeNone}),
        TweenMax.to('.iabout__text-type[data-step="2"]', 1, {opacity: 0, left: '-20px', display: 'none', ease: Linear.easeNone})
      ])
      sceneFeat2Fade.setTween(timelineFeat2Fade)
      
      const timelineFeat3 = new TimelineMax()
      const sceneFeat3 = new ScrollMagic.Scene({
        triggerElement: '.js-dishes-spacer[data-step="3"]',
        duration: positionHeight * .25
      })
      timelineFeat3.add([
        TweenMax.to('.iabout__verloni-value[data-step="3"]', 1, {opacity: 1, right: '0px', ease: Linear.easeNone}),
        TweenMax.to('.iabout__text-type[data-step="3"]', 1, {opacity: 1, left: '0px', display: 'block', ease: Linear.easeNone})
      ])
      sceneFeat3.setTween(timelineFeat3)
      
      controller.addScene([
        sceneDish1,
        sceneDish2,
        sceneDish3,
        sceneFeat1,
        sceneFeat2,
        sceneFeat2Fade,
        sceneFeat3
      ])
    },

    contactsMap: () => {
      const coords = document.querySelector('.js-contacts-map').getAttribute('data-coords').split(','),
            myLatlng = new google.maps.LatLng(+coords[0],+coords[1]), mapOptions = {
              zoom: 17,
              center: myLatlng,
              disableDefaultUI: true
            }

      const map = new google.maps.Map(document.querySelector('.js-contacts-map'), mapOptions)

      const marker = new google.maps.Marker({
        position: myLatlng,
        //icon: 'static/i/pin.png'
        icon: '/local/templates/.default/src/i/pin.png'
      })

      marker.setMap(map)
    },

    resizeWatcher: () => {
      const tableSel = document.querySelectorAll('table'),
        scrollArray = [];
      if (tableSel.length) {
        tableSel.forEach((item, i) => {
          let orgHtml = item.outerHTML,
            def = 'default';

          if (item.getAttribute('class')) def = '';

          item.outerHTML = `<div class='table-scroller${i} ${def}'>${orgHtml}</div>`;
          let ps = new PerfectScrollbar(`.table-scroller${i}`, {
            wheelPropagation: true
          });
          scrollArray.push(ps);
        });
        window.addEventListener('resize', () => {
          if (scrollArray.length)
            scrollArray.forEach((item, i) => {
              item.update()
            });
        });
      }

    },

    progressUpdate: (val) => {
      const progressEl = document.querySelector('.js-progress')

      progressEl.style.height = val + '%'
    },
    
    collectionsCars: () => {
      const headerEl = document.querySelector('.header'),
        bodyEl = document.querySelector('body'),
        carElemCount = document.querySelector('.js-collections .swiper-wrapper').children.length,
        hrefToSlide = document.querySelectorAll('.js-icollections-toslide')
      
      let toNextCollection = document.querySelector('.js-coltonext')

      const carVertSwiper = new Swiper('.js-collections', {
        speed: 1500,
        direction: 'vertical',
        slidesPerView: 1,
        spaceBetween: -1,
        mousewheel: {
          releaseOnEdges: true
        },
        allowTouchMove: window.xs && window.touch
      })

      carVertSwiper.on('slideChangeTransitionStart', function () {
        if (toNextCollection) {
          toNextCollection.parentNode.removeChild(toNextCollection)
          toNextCollection = false
        }
        if (this.activeIndex) {
          headerEl.classList.add('hidden')
          window.verloni.obj.progressUpdate(Math.floor((this.activeIndex + 1) * 100 / carElemCount))
        } else {
          headerEl.classList.remove('hidden')
          window.verloni.obj.progressUpdate(0)
        }
      })

      for (let item of hrefToSlide) {
        item.addEventListener('click', () => {
          let type = item.getAttribute('data-type'),
            slideIndex = $(`.js-collections .swiper-slide[data-slide="${type}"]`).index()
          carVertSwiper.slideTo(slideIndex, 1500)
        })
      }
      
      let hash = window.location.hash
      if (hash) {
        hash = hash.substr(1)
        let slideIndex = $(`.js-collections .swiper-slide[data-slide="${hash}"]`).index()
        carVertSwiper.slideTo(slideIndex, 1500)
      }

    },
    
    collections: () => {
      const colItems = document.querySelectorAll('.js-icollections-btn')
      
      for (let colItem of colItems) {
        colItem.addEventListener('click', (e) => {
          if (colItem.classList.contains('active')) {
            e.preventDefault()
            return
          }
          
          const tabId = colItem.getAttribute('data-type'),
                curTab = document.querySelector('.js-icollections-tab.active'),
                newTab = document.querySelector(`.js-icollections-tab[data-type="${tabId}"]`)
          
          document.querySelector('.js-icollections-btn.active').classList.remove('active')
          colItem.classList.add('active')
          
          window.animation.fadeOut(curTab, 200, () => {
            curTab.classList.remove('active')
            window.animation.fadeIn(newTab, 200, () => {
              newTab.classList.add('active')
            })
          })
          
          e.preventDefault()
        })
      }
      
    },
    
    asyncScroll: () => {
      if (window.mobile) return false
      
      const featElems = document.querySelectorAll('.js-async-scroll')
      
      for (let item of featElems) {
        item.setAttribute('data-top', parseInt(getComputedStyle(item)['top']))
      }
      
      window.addEventListener('scroll', () => {
        for (let item of featElems) {
          const rect = item.getBoundingClientRect(),
                diff = rect.bottom - item.offsetHeight - (window.innerHeight || document.documentElement.clientHeight),
                dataKoef = item.getAttribute('data-koef'),
                dataTop = item.getAttribute('data-top')
          
          if (diff <= 0 && (rect.top + item.offsetHeight >= 0)) {
            item.style.top = dataTop - diff * dataKoef + 'px'
          }
        }
      })
    },
    
    whereList: () => {
      const btn = document.querySelector('.js-where-more'),
            hiddenCols = document.querySelectorAll('.where__adresses-col.hidden')
      
      btn.addEventListener('click', (e) => {
        for(let hiddenCol of hiddenCols) {
          window.animation.fadeIn(hiddenCol, 400)
        }
        
        window.animation.fadeOut(btn, 400)
        e.preventDefault()
      })
    },
    
    changerFunction: (elem, newsrc) => {
      window.animation.fadeOut(elem, 300, () => {
        elem.setAttribute('src', newsrc)
        window.animation.fadeIn(elem, 300)
      })
    },
    
    changeImageSrc: () => {
      const colorChangers = document.querySelectorAll('.js-info-color'),
            cardChangers = document.querySelectorAll('.js-card-thumb'),
            colorImg = document.querySelector('.js-info-img'),
            cardImg = document.querySelector('.js-card-mainimg')
      
      for (let colorChanger of colorChangers) {
        colorChanger.addEventListener('click', () => {
          if (!colorChanger.classList.contains('active')) {
            window.verloni.obj.changerFunction(colorImg, colorChanger.getAttribute('data-src'))
            
            for (let temp of colorChangers) temp.classList.remove('active')
            colorChanger.classList.add('active')
          }
        })
      }
      
      for (let cardChanger of cardChangers) {
        cardChanger.addEventListener('click', () => {
          if (!cardChanger.classList.contains('active')) {
            window.verloni.obj.changerFunction(cardImg, cardChanger.getAttribute('data-src'))
            
            for (let temp of cardChangers) temp.classList.remove('active')
            cardChanger.classList.add('active')
          }
        })
      }
      
    },
    
    init: function () {

      const burgerEl = document.querySelector('.js-burger'),
        html = document.querySelector('html'),
        headerEl = document.querySelector('.header'),
        toNext = document.querySelector('.js-tonext'),
        toNextCollection = document.querySelector('.js-coltonext'),
        elemsToCheck = ['.news__elem-imgover', '.js-scroll-imgover', '.about__steps-elem']

      burgerEl.addEventListener('click', (e) => {
        html.classList.toggle('burgeropen')
        if (burgerEl.classList.contains('open')) {
          burgerEl.classList.add('remove')
          setTimeout(() => {
            burgerEl.classList.remove('open', 'remove')
          }, 1000)
        } else {
          burgerEl.classList.add('open')
        }
        e.preventDefault()
      })
      
      if (toNext) {
        toNext.addEventListener('click', (e) => {
          window.animation.scrollTo(document.querySelector('.idishes').offsetTop, 1000)
          e.preventDefault()
        })
      }
      
      if (toNextCollection) {
        toNextCollection.addEventListener('click', (e) => {
          const mySwiper = document.querySelector('.js-collections').swiper
          mySwiper.slideNext()
          toNextCollection.parentNode.removeChild(toNextCollection)
          e.preventDefault()
        })
      }

      if (document.querySelector('.js-ibanner')) this.indexBannerCarousel()
      
      if (document.querySelector('.js-igal')) this.indexGalleryCarousel()

      if (document.querySelector('.js-contacts-map')) this.contactsMap()

      if (document.querySelector('.js-async-scroll')) this.asyncScroll()
      
      if (document.querySelector('.js-icollections-btn')) this.collections()
      
      if (document.querySelector('.js-dishes')) this.indexDishes()
      
      if (document.querySelector('.js-where-more')) this.whereList()
      
      if (document.querySelector('.js-collections')) this.collectionsCars()
      
      if (document.querySelectorAll('.js-info-color').length || document.querySelectorAll('.js-card-thumb').length) this.changeImageSrc()
      
      if (document.querySelectorAll('.js-text-fixed').length) {
        for (let fixElem of document.querySelectorAll('.js-text-fixed')) {
          fixElem.setAttribute('data-left', fixElem.getBoundingClientRect().left)
          fixElem.setAttribute('data-top', fixElem.getBoundingClientRect().top)
        }
        window.addEventListener('mousemove', (event) => {
          const centerX = Math.round(window.innerWidth / 2),
              centerY = Math.round(window.innerHeight / 2),
              diffX = - (event.clientX - centerX) / centerX,
              diffY = - (event.clientY - centerY) / centerY 
          
          for (let fixElem of document.querySelectorAll('.js-text-fixed')) {
            TweenMax.to(
              fixElem, 
              1, 
              {
                'left': fixElem.getAttribute('data-left') - Math.round(fixElem.getAttribute('data-round') * diffX),
                'top': fixElem.getAttribute('data-top') - Math.round(fixElem.getAttribute('data-round') * diffY), 
                ease:Expo.easeOut
              }
            )
          }
        })
        window.addEventListener('resize', () => {
          for (let fixElem of document.querySelectorAll('.js-text-fixed')) {
            fixElem.removeAttribute('style')
            fixElem.setAttribute('data-left', fixElem.getBoundingClientRect().left)
            fixElem.setAttribute('data-top', fixElem.getBoundingClientRect().top)
          }
        })
      }
      
      
      window.addEventListener('resize', () => {
        window.xs = window.innerWidth <= 960 ? true : false
        window.mobile = window.innerWidth <= 480 ? true : false
        window.xsHeight = window.innerHeight <= 540 ? true : false
      })

      window.addEventListener('scroll', () => {
        for (let item of elemsToCheck) {
          for (let elem of document.querySelectorAll(item)) {
            if (window.animation.visChecker(elem)) {
              elem.classList.add('visible')
            }
          }
        }
      })

      this.resizeWatcher()

      let eventResize
      try {
        eventResize = new Event('resize')
      }
      catch (e) {
        eventResize = document.createEvent('Event')
        let doesnt_bubble = false,
            isnt_cancelable = false
        eventResize.initEvent('resize', doesnt_bubble, isnt_cancelable);
      }
      window.dispatchEvent(eventResize)
      
      let eventScroll
      try {
        eventScroll = new Event('scroll')
      }
      catch (e) {
        eventScroll = document.createEvent('Event');
        let doesnt_bubble = false,
            isnt_cancelable = false
        eventScroll.initEvent('scroll', doesnt_bubble, isnt_cancelable);
      }
      window.dispatchEvent(eventScroll)

      return this
    }
  });

  Pace.on('hide', () => {
    setTimeout(() => {
      window.verloni.obj.init()
    }, 200)
  })
  
})();

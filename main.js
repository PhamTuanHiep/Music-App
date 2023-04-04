        /**
         * 1. Render song
         * 2. Scroll top
         * 3. Play/ pause/seek
         * 4. CD rotate
         * 5. Next / prev
         * 6. Random
         * 7. Next / Repeat when ended
         * 8. Active song
         * 9. Scroll active song into view
         * 10. Play song when click
        */

        const $ = document.querySelector.bind(document)
        const $$ = document.querySelectorAll.bind(document)

        const playlist = $('.playlist')
        const cdThumb = $('.cd-thumb')
        const cdwidth = cdThumb.offsetWidth
        const heading = $('header h2')
        const progress = $('#progress')

        const player = $('.player')
        const audio = $("#audio")
        const playBtn = $('.btn-toggle-play')
        const nextBtn = $('.btn-next')
        const prevBtn = $('.btn-prev')
        const randomBtn = $('.btn-random')
        const repeatBtn = $('.btn-repeat')

        const app={
            currentIndex:0,
            isPlaying:false,
            isRandom: false,
            isReapeat: false,
            songs: [
                {
                name: 'Bài này chill phết',
                singer:'Đen Vâu ft.Min',
                path:'./assets/music/bainaychillphet.mp3',
                image: './assets/img/bainaychillphet.jpg'
                },
                {
                name: 'Có ai muốn nghe không',
                singer:'Đen Vâu',
                path:'./assets/music/coaimuonnghekhong.mp3',
                image: './assets/img/coaimuongnghekhong.jpg'
                },
                {
                name: 'Em bỏ hút thuốc chưa',
                singer:'Bích phương',
                path:'./assets/music/embohutthuochua.mp3',
                image: './assets/img/embohutthuochua.png'
                },
                {
                name: 'Gửi anh xa nhớ',
                singer:'Bích phương',
                path:'./assets/music/guianhxanho.mp3',
                image: './assets/img/guianhxanho.jpg'
                },
                {
                name: 'Mười năm',
                singer:'Đen Vâu',
                path:'./assets/music/muoinam.mp3',
                image: './assets/img/muoinam.jpg'
                },
                {
                name: 'Trốn tìm',
                singer:'Đen Vâu',
                path:'./assets/music/trontim.mp4',
                image: './assets/img/trontim.jpg'
                }
            ],
            render: function(){
                const html = this.songs.map((song,index) => 
                    `
                    <div class="song ${ index === this.currentIndex ? 'active':""}" data-index='${index}'>
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                    </div>
                    `)
                playlist.innerHTML = html.join('')
            },
            defindProperties: function(){
                Object.defineProperty(this, 'currentSong',{
                 get: function(){
                    return this.songs[this.currentIndex]}
                })
            },
            loadCurrentSong: function(){
                heading.textContent = this.currentSong.name
                cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
                $('audio').src = this.currentSong.path
            },
            
            handleEvents: function(){
                _this = this
                //1.Xử lý thu nhỏ CD
                document.onscroll = function(){
                    const scrollTop = window.scrollY || document.documentElement.scrollTop
                    const newCDWidth = cdwidth - scrollTop
                    $('.cd').style.width = newCDWidth >0 ? newCDWidth +'px':0
                    $('.cd').style.opacity = newCDWidth/cdwidth
                }

                //2.0 Xử lý play/pause song
                playBtn.onclick = function(){
                    if(_this.isPlaying){
                        audio.pause()
                    }
                    else{
                        audio.play()
                    }
                }

                //2.1 Các tác vụ khi play/pause audio
                audio.onplay = function(){
                    _this.isPlaying = true
                    player.classList.add('playing')
                    rotateCD.play()
                }
                audio.onpause = function(){
                    _this.isPlaying = false
                    player.classList.remove('playing')
                    rotateCD.pause()
                }

                //3. Xử lý hiển thị thời gian phát và tua ( theo % thời gian)
                audio.ontimeupdate= function(){
                    if(audio.duration){
                        const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
                        progress.value = progressPercent
                    }
                }
                progress.onchange = function(){
                    audio.currentTime = progress.value * audio.duration/100
                }

                //4. Xử lý rotate CD
                const rotateCD = cdThumb.animate(
                    [
                        {transform: 'rotate(0deg)'},
                        {transform:'rotate(360deg)'}
                    ],
                    {
                        duration: 10000,
                        iterations:Infinity
                    }
                )
                rotateCD.pause()

                //5. Xử lí next/prev
                nextBtn.onclick = function(){
                    if(_this.isRandom){
                        _this.randomSong()
                    }
                    else{
                        _this.nextSong()
                    }
                    audio.play()
                    _this.render()
                    _this.scrollToActiveSong()
                }
                prevBtn.onclick = function(){
                    if(_this.isRandom){
                        _this.randomSong()
                    }
                    else{
                        _this.prevSong()
                    }
                    audio.play()
                    _this.render()
                    _this.scrollToActiveSong()
                }
                //6. Xử lí random song list
                randomBtn.onclick = function(){
                    _this.isRandom =!_this.isRandom
                    randomBtn.classList.toggle('active')
                }
                //Xử lí lặp song
                repeatBtn.onclick = function(){
                    _this.isReapeat = !_this.isReapeat
                    repeatBtn.classList.toggle('active',_this.isRepeat)
                }
                //Xử lí khi kết 1 song
                audio.onended = function(){
                    if(_this.isReapeat){
                    audio.play()
                    }
                    else{
                        nextBtn.click()
                    }
                }

                //Xử lí select 1 song
                playlist.onclick = function(e){
                    const songNode = e.target.closest('.song:not(.active)')
                    if(songNode || e.target.closest('.option')){
                        if(songNode){
                            _this.currentIndex = Number(songNode.dataset.index)
                            _this.loadCurrentSong()
                            _this.render()
                            audio.play()
                            _this.scrollToActiveSong()
                        }
                    }
                }

            },
            scrollToActiveSong: function(){
                setTimeout(()=>{
                    $('.song.active').scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    })
                },500)
            },
            nextSong: function(){
                if( this.currentIndex < this.songs.length-1){
                    this.currentIndex++
                }
                else{
                this.currentIndex = 0
                }
                this.loadCurrentSong()
            },
            prevSong: function(){
                if( this.currentIndex == 0 ){
                    this.currentIndex = this.songs.length-1
                }
                else{
                    this.currentIndex--
                }
                this.loadCurrentSong()
            },
            randomSong:function(){
                let randomIndex = 0
                do{
                     randomIndex  = Math.floor(Math.random()*this.songs.length)
                }while(this.currentIndex === randomIndex)
                this.currentIndex = randomIndex
                this.loadCurrentSong()
            },
            start : function(){
                // Xử lí các sự kiện
                this.handleEvents()
                //Định nghĩa lại thuộc tính: cụ thể là tạo object về 1 bài hát với các thuộc tính của nó
                this.defindProperties()
                //truyền thông tin song lên head
                this.loadCurrentSong()
                //tải lại thông tin song list
                this.render()
            }
        }
        app.start()

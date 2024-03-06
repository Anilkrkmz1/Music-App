// ELEMENTLER ULAŞMA

const prevButton = document.getElementById('prev')
const nextButton = document.getElementById('next')
const repeatButton = document.getElementById('repeat')
const shuffleButton = document.getElementById('shuffle')
const audio = document.getElementById('audio')
const songImage = document.getElementById('song-image')
const songName = document.getElementById('song-name')
const songArtist = document.getElementById('song-artist')
const pauseButton = document.getElementById('pause')
const playButton = document.getElementById('play')
const playListButton = document.getElementById('playlist')

const maxDuration = document.getElementById('max-duration')
const currentTimeRef = document.getElementById('current-time')

const progressBar = document.getElementById('progress-bar')
const playListContainer = document.getElementById('playlist-container')
const closeButton= document.getElementById('close-button')
const playListSongs = document.getElementById('playlist-songs')

const currentProgress = document.getElementById('current-progress')

// SIRA
let index

// DÖNGÜ
let loop = true

// JSON VERİSİ
const songList = [
    {
        name: "Return To Oz",
        link: "assets/Return.mp3",
        artist: "Monolink",
        image: "assets/Monolink.jpg"
    },
    {
        name: "Puppet Theatre",
        link: "assets/Puppet.mp3",
        artist: "Claptone",
        image: "assets/claptone.jpg"
    },
    {
        name: "Tataki",
        link: "assets/tataki.mp3",
        artist: "Argy",
        image: "assets/argy.jpg"
    },
    {
        name: "Horizon",
        link: "assets/horizon.mp3",
        artist: "Artbat",
        image: "assets/artbat.jpg"
    },
    {
        name: "Gravity",
        link: "assets/gravity.mp3",
        artist: "Boris Brejcha",
        image: "assets/boris-brejcha.jpeg"
    },
    {
        name: "Tranceform",
        link: "assets/tranceform.mp3",
        artist: "Liquid Soul & Alchimyst",
        image: "assets/Liquid.jpg"
    }
]

// OYNAT
const playAudio = () =>{
    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')
}

// DURDUR
const pauseAudio = () =>{
    audio.pause()
    pauseButton.classList.add('hide')
    playButton.classList.remove('hide')
}

// ŞARKI ATA
const setSong = (arrayIndex) =>{
    let {name, link, artist, image} = songList[arrayIndex]

    audio.src = link
    songName.innerHTML = name 
    songArtist.innerHTML = artist
    songImage.src = image

    audio.onloadedmetadata = () =>{
// saniye hesapla
        maxDuration.innerText = timeFormatter(audio.duration)
    }
    playListContainer.classList.add('hide')
    playAudio()
}

// SÜREKLİ SANİYE KONTROLÜ YAPMA
setInterval(() => {
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime)
    // Progressi ilerletme
    currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%"
}, 1000);

// ŞARKI SÜRESİ DEĞİŞİM KISMI TIKLANILDIĞINDA
progressBar.addEventListener('click',(event)=>{
    // başlangıç
    let coordStart = progressBar.getBoundingClientRect().left
    console.log(coordStart)

    // x ekseninde tıklama noktaı
    let coordEnd = event.clientX
    console.log(coordEnd)
    console.log(progressBar.offsetWidth)

    let progress = (coordEnd - coordStart) / progressBar.offsetWidth
    console.log(progress)

    // progressi ilerlet
    currentProgress.style.width = progress * 100 + "%"
    // sesi değiştir
    audio.currentTime = progress * audio.duration
    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')
})

// ZAMAN FORMATLA
const timeFormatter = (timeInput) =>{
    let minute = Math.floor(timeInput / 60)
    minute = minute < 10 ? "0"+minute : minute
    let second = Math.floor(timeInput % 60)
    second = second < 10 ? "0"+second : second
    return `${minute}:${second}`
}
const previousSong = () => {
    if (index > 0) {
        pauseAudio()
        index = index - 1
    } else {
        index = songList.length - 1
    }
    setSong(index)
}
const nextSong = () =>{
    if (loop) {
        if (index == (songList.length - 1)) {
            index = 0
        }else {
            index = index + 1
    }
    setSong(index)
} else {
    let randIndex = Math.floor(Math.random() * songList.length)
    setSong(randIndex)
}
}

// TEKRAR BUTONUNA TIKLANILDIĞINDA
repeatButton.addEventListener('click', () =>{
    if (repeatButton.classList.contains('active')) {
        repeatButton.classList.remove('active')
        audio.loop = false
    } else {
        repeatButton.classList.add('active')
        audio.loop = true
    }
})

// KARIŞTIRICI TIKLANILDIĞINDA
shuffleButton.addEventListener('click', ()=>{
    if (shuffleButton.classList.contains('active')) {
        shuffleButton.classList.remove('active')
        audio.loop = true
    } else {
        shuffleButton.classList.add('active')
        audio.loop = false
    }
})

// ŞARKI BİTTİĞİNDE
audio.onended = () =>{
    nextSong() 
}

playListButton.addEventListener('click',()=>{
    playListContainer.classList.remove('hide')
})

closeButton.addEventListener('click',()=>{
    playListContainer.classList.add('hide')
})

// OYNAT BUTONUNA TIKLANILDIĞINDA
playButton.addEventListener('click',playAudio)

// DURDUR BUTONUNA TIKLANILDIĞINDA
pauseButton.addEventListener('click',pauseAudio)

// ÖNCEKİ TILANILDIĞINDA
prevButton.addEventListener('click',previousSong)

// SONRAKİ TIKLANILDIĞINDA
nextButton.addEventListener('click',nextSong)

const initializePlaylist = () =>{
    for(let i in songList){
        playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container">
        <img src="${songList[i].image}"/>
        </div>
        <div class="playlist-song-details">
        <span id="playlist-song-name">
        ${songList[i].name}
        </span>
        <span id="playlist-artist-album">
        ${songList[i].artist}
        </span>
        </div>
        </li>`
    }
}

window.onload = () => {
    index = 0
    setSong(index)
    pauseAudio()
    initializePlaylist()
}
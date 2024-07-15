
const playPauseSongButton = document.getElementById('play-pause-song-button');
const nextSongButton = document.getElementById('next-song-button');
const previousSongButton = document.getElementById('previous-song-button');
const uploadSongButton = document.getElementById('upload-button');
const shuffleButton = document.getElementById('shuffle-button');
const timeBar = document.getElementById('time-bar');
const timeBarDisplay = document.getElementById('time-bar-display');

uploadSongButton.addEventListener('change', async () => {
    const files = uploadSongButton.files;
    
    arrBlobAudio = [...files];
    arrTempReaderAudio = [...files]

    console.log(arrBlobAudio)

    await turnIntoData();
    sendToPlayList();
})



const turnIntoData = () => {
    return Promise.all(
        arrTempReaderAudio.map((file) => {
            return new Promise((resolve) => {
                if (file instanceof Blob) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.addEventListener('load', (e) => {
                        const readerTarget = e.target;
                        arrFileReader.push(readerTarget.result);
                        resolve();
                    });
                }
            });
        })
    );
};

const sendToPlayList = () => {
    const dataArray = arrBlobAudio.map((info, index) => ({
        info: info,
        data: arrFileReader[index]
    }));
    
    dataArray.forEach((e) => {
        jsmediatags.read(e.info, {
                onSuccess: function(tag) {
                    
                    console.log(tag)

                    try{
                        var data = tag.tags.picture.data;
                        var format = tag.tags.picture.format
                        let base64String = "";
                        for (const i = 0; i < data.length; i++) {
                        base64String += String.fromCharCode(data[i]);
                        }

                        var imageUrl = `url(data:${format};base64,${window.btoa(base64String)})`
                    }catch{
                        console.log('no album image')
                    }
                    console.log("s")
                    playListSongs.push(
                        {
                            songName: tag.tags.title || "Desconhecido",
                            songArtist: tag.tags.artist || null,
                            songAlbum: tag.tags.album || null,
                            songFile: e.data,
                            albumPicture: imageUrl || null,
                        }
                    )
                    console.log(playListSongs);
                    currentPlayList = [...playListSongs];
                    showPlaylistSongs();
                },
                onError: function(error) {
                    return console.log(error)
                }
        });
    })
}

const jsmediatags = window.jsmediatags
let arrBlobAudio = []
let arrTempReaderAudio = []
let arrFileReader = []

let audio = new Audio();

let playListSongs = [
    {
        songName: "Valerie",
        songArtist: "The Weeknd",
        songAlbum: "Trilogy",
        songFile: "../songs/valerie.mp3",
    },
    {
        songName: "The Hills",
        songArtist: "The Weeknd",
        songAlbum: "Beauty Behind the Madness",
        songFile: "../songs/the-hills.mp3",
    },
    {
        songName: "Some Unholy War",
        songArtist: "Amy Winehouse",
        songAlbum: "Back to Black",
        songFile: "../songs/some-unholy-war.mp3",
    }
]

let currentPlayList = [...playListSongs];
let currentSongIndex = 0;

const playSong = (indexPlaylist) => {
    const songToPlay = currentPlayList[indexPlaylist]?.songFile;
    audio.src = songToPlay;
    audio.play();
    console.log(`Está tocando ${currentPlayList[indexPlaylist].songName}`);
    playPauseSongButton.src = "midia/pause-music.png";
    document.querySelector('.song-info').style.display = 'flex';
    document.getElementById('song-name').innerText = currentPlayList[indexPlaylist].songName;
    document.getElementById('song-artist-album').innerText = `${currentPlayList[indexPlaylist].songArtist} - ${currentPlayList[indexPlaylist]?.songAlbum}`;
};


audio.addEventListener('timeupdate', () =>{
    const timeLeftSeconds = audio.duration - audio.currentTime;
    const minutes = Math.floor(timeLeftSeconds / 60).toString().padStart(2, '0');
    const seconds = Math.floor(timeLeftSeconds - minutes * 60).toString().padStart(2, '0');
    document.getElementById('time-left').innerHTML = minutes + ":" + seconds;
    }
)

audio.addEventListener('timeupdate', () => {
    let currentTime = audio.currentTime;
    let duration = audio.duration;
    let progress = (currentTime / duration) * 100;
    console.log(progress)
    timeBarDisplay.style.display = "flex";
    timeBar.style.width = progress + "%";
});


const playChosenSong = (indexPlaylist) => {
    if (!audio.paused) {
        audio.pause();
        console.log(`O audio ${currentPlayList[currentSongIndex].songName} foi pausado`);
    }
    currentSongIndex = indexPlaylist;
    playSong(currentSongIndex);
    console.log(currentSongIndex)
};



const pauseMusic = () => {
    if (audio.paused) {
        audio.play();
        playPauseSongButton.src = "midia/pause-music.png";
        console.log("Play");
    } else{
        audio.pause();
        playPauseSongButton.src = "midia/play-button.png";
        console.log("Pause")
    }
};


const nextSong = () => {
    if(audio.currentTime == 0 && currentSongIndex == 0){
        playSong(currentSongIndex);
        playPauseSongButton.src = "midia/pause-music.png";
    }else{
        audio.pause();
        if (currentSongIndex < currentPlayList.length){
            currentSongIndex = currentSongIndex + 1;
            playSong(currentSongIndex);
        }else{
            console.log("Acabo as música");
        }
    }
}

const previousSong = () => {
    if(currentSongIndex == 0){
        playSong(currentSongIndex);
        playPauseSongButton.src = "midia/pause-music.png";
    }else if(audio.currentTime > 5){
        audio.pause();
        playSong(currentSongIndex);
    }else{
        audio.pause();
        currentSongIndex = --currentSongIndex;
        playSong(currentSongIndex);
    }

}




const showPlaylistSongs = () => {
    const htmlShowSong = currentPlayList.map((element) =>{return `
            <div class="div-song">
                <div class="song">
                        <div class="playlist-song-info" onclick="playChosenSong(${currentPlayList.indexOf(element)})">
                            <span class="song-name-playlist">${element?.songName}</span>
                            <span class="song-artist-album-playlist">${element?.songArtist? element?.songArtist :""}${element?.songAlbum? " - " + element?.songAlbum: ""}</span>
                        </div>
                        
                    </div>
                <div class="divider"></div>
            </div>`
    })
    document.querySelector(".music-playlist").innerHTML = htmlShowSong.join(" ")
}

const shuffleSongs = (playlist) => {
    for(let indice = playlist.length; indice; indice--){
        const indiceAleatorio = Math.floor(Math.random() * indice)
        const musica = currentPlayList[indice - 1];
        currentPlayList[indice - 1] = currentPlayList[indiceAleatorio];
        currentPlayList[indiceAleatorio] = musica;
    }
    showPlaylistSongs();
}

showPlaylistSongs();




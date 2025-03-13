function TrailerVideo({ movieDetail }) {
    return (
        <iframe
            
        
        src={`https://www.youtube-nocookie.com/embed/${movieDetail.trailerCode}`}
            //src={`https://www.2embed.to/embed/imdb/movie?id=${imdbId}`}
            width="100%"
            height="100%"
            style={{ borderRadius: '10px', overflow: 'hidden' }}
            title="video"
        ></iframe>
    );
}

export default TrailerVideo;

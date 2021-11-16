import React, {useEffect, useState} from "react";
import './App.css'
import Tmdb from "./Tmdb";
import MovieRow from "./components/MovieRow";
import FeaturedMovie from "./components/FeaturedMovie";
import Header from "./components/Header";

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      // Pegando a lista Total
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // Pegando o Featured
      let originals = list.filter(i=> i.slug==='originals');
      let ramdomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1));
      let chosen = originals[0].items.results[ramdomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');

      setFeaturedData(chosenInfo);
    }
    loadAll();
  },[]);
  useEffect(()=> {
    const scrollListiner = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }
    window.addEventListener('scroll', scrollListiner);

    return () => {
      window.removeEventListener('scroll, scrollListener')
    }
  },[]);

  return (
    <div className="page">

      <Header black={blackHeader} />
      {featuredData && 
      <FeaturedMovie item={featuredData} />
      }

      <section className='lists'>
        {movieList.map((item, key) =>(
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>
     <footer>
       Desenvolvido para <span role="img" arial-label=""></span> Teste de Avaliação <br />
       Direitos de imagem Neflix <br/>
       Dados pegos no site Themoviedb.org
     </footer>
     
     {movieList.length <=0 &&
      <div className="loading">
        <img src="https://www.wired.com/2016/01/the-counterintuitive-tech-behind-netflixs-worldwide-launch/" alt="Carregando" />
      </div>
     }
     
    </div>
  );
}
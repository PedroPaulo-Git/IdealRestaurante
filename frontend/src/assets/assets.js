
import Logo from './Logo.png';
import LogoFooter from './LogoFooter.png';
import LogoFoooter2 from './LogoFooterwhite.png';
import Rating_star from "./rating_star.png";
import Plus from './plus.png';
import More from './more.png';
import Less from './less.png';
import AppDownloadIMG_Apple from './AppDownload_apple.png';
import AppDownloadIMG_Google from './AppDownload_google.png';

import ExploreImage from './ExploreImage.jpg';
import ExploreImage2 from './ExploreImage2.jpg';
import ExploreImage3 from './ExploreImage3.jpg';
import ExploreImage4 from './ExploreImage4.jpg';
import ExploreImage5 from './ExploreImage5.png';
import ExploreImage6 from './ExploreImage6.jpg';
import ExploreImage7 from './ExploreImage7.jpg';
import ExploreImage8 from './ExploreImage8.png';

import Pizza1 from './Pizza1.jpg';
import Pizza2 from './Pizza2.jpg';
import Pizza3 from './Pizza3.jpg';

import Salad1 from './Salad1.jpg';
import Salad2 from './Salad2.jpg';

import Meats1 from './Meats1.jpg';
import Meats2 from './Meats2.jpg';
import Meats3 from './Meats3.jpg';
import Meats4 from './Meats4.jpeg';
import Meats5 from './Meats5.jpg';



export const assets = {
    Logo,
    LogoFooter,
    LogoFoooter2,
    Rating_star: Rating_star,
    Plus,
    More,
    Less,
    AppDownloadIMG_Apple,
    AppDownloadIMG_Google
}

export const assets_menuList = [
      
    {
        menu_name:"Pizza",
        menu_image:ExploreImage
    }, 
    {
        menu_name:'Doces',
        menu_image:ExploreImage8
    },
    {
        menu_name:'Salada',
        menu_image:ExploreImage2
    },
 
    {
        menu_name:'Almoços',
        menu_image:ExploreImage3
    },
    {
        menu_name:'Fritas',
        menu_image:ExploreImage4
    },
    {
        menu_name:'Bebidas',
        menu_image:ExploreImage5
    },
    {
        menu_name:'Sushi',
        menu_image:ExploreImage6
    },
    {
        menu_name:'Carne',
        menu_image:ExploreImage7
    },
]

export const food_list = [
    {
        _id: '1',
        name: 'Pizzas Tradicionais',
        image: Pizza1,
        price: 52,
        description: 'Uma seleção incrível de pizzas tradicionais com sabores clássicos.',
        category: 'Pizza'
    },
    {
        _id: '2',
        name: 'Pizzas Especiais',
        image: Pizza2,
        price: 55,
        description: 'Descubra nossas pizzas especiais com uma combinação única de sabores.',
        category: 'Pizza'
    },
    {
        _id: '3',
        name: 'Pizzas Doces',
        image: Pizza3,
        price: 45,
        description: 'Deleite-se com nossas deliciosas pizzas doces.',
        category: 'Pizza'
    },

//     /* SALADAS >>>>*/
    {
        _id: '4',
        name: 'Salada Caesar',
        image: Salad1,
        price: 30,
        description: 'Uma salada fresca com alface, croutons, queijo parmesão e molho Caesar.',
        category: 'Salada'
    },
    {
        _id: '5',
        name: 'Salada de Frutas',
        image: Salad2,
        price: 25,
        description: 'Uma opção refrescante e saudável com uma variedade de frutas frescas.',
        category: 'Salada'
    },

  /* CARNES >>>>*/
    {
        _id: '6',
        name: 'Bife de Filé Mignon',
        image: Meats1,
        price: 60,
        description: 'Delicioso bife de filé mignon grelhado.',
        category: 'Carne'
    },
    {
        _id: '7',
        name: 'Costela BBQ',
        image: Meats2,
        price: 55,
        description: 'Costela suculenta com molho barbecue.',
        category: 'Carne'
    },
    {
        _id: '8',
        name: 'Frango Grelhado',
        image: Meats3,
        price: 35,
        description: 'Peito de frango grelhado servido com acompanhamentos deliciosos.',
        category: 'Carne'
    },
    {
        _id: '9',
        name: 'Hambúrguer Clássico',
        image: Meats4,
        price: 40,
        description: 'Um hambúrguer suculento com todos os acompanhamentos clássicos.',
        category: 'Carne'
    },
    {
        _id: '10',
        name: 'Churrasco de Picanha',
        image: Meats5,
        price: 65,
        description: 'Picanha grelhada no ponto certo, acompanhada de arroz, feijão e farofa.',
        category: 'Carne'
    },
    

]


import Logo from './Logo.png';
import LogoFooter from './LogoFooter.png';
import LogoFoooter2 from './LogoFooterwhite.png';
import Rating_star from "./rating_star.png";
import Plus from './plus.png';
import More from './more.png';
import Less from './less.png';
import AppDownloadIMG_Apple from './AppDownload_apple.png';
import AppDownloadIMG_Google from './AppDownload_google.png';
import Close from './Close.png';

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

import Sushi1 from './Sushi1.jpg';
import Sushi2 from './Sushi2.jpg';
import Sushi3 from './Sushi3.jpg';
import Sushi4 from './Sushi4.jpg';
import Sushi5 from './Sushi5.jpg';
import Sushi6 from './Sushi6.jpg';

import Meats1 from './Meats1.jpg';
import Meats2 from './Meats2.jpg';
import Meats3 from './Meats3.jpg';
import Meats4 from './Meats4.jpeg';
import Meats5 from './Meats5.jpg';

import Dinner1 from './Dinner1.jpg';
import Dinner2 from './Dinner2.jpg';
import Dinner3 from './Dinner3.jpg';
import Dinner4 from './Dinner4.jpg';
import Dinner5 from './Dinner5.jpg';

import Frites1 from './Frites1.jpg';
import Frites2 from './Frites2.jpg';
import Frites3 from './Frites3.jpg';
import Frites4 from './Frites4.jpg';


export const assets = {
    Logo,
    LogoFooter,
    LogoFoooter2,
    Rating_star: Rating_star,
    Plus,
    More,
    Less,
    AppDownloadIMG_Apple,
    AppDownloadIMG_Google,
    Close
}

export const assets_menuList = [

    {
        menu_name: "Pizza",
        menu_image: ExploreImage
    },
    {
        menu_name: 'Doces',
        menu_image: ExploreImage8
    },
    {
        menu_name: 'Salada',
        menu_image: ExploreImage2
    },

    {
        menu_name: 'Almoços',
        menu_image: ExploreImage3
    },
    {
        menu_name: 'Fritas',
        menu_image: ExploreImage4
    },
    {
        menu_name: 'Bebidas',
        menu_image: ExploreImage5
    },
    {
        menu_name: 'Sushi',
        menu_image: ExploreImage6
    },
    {
        menu_name: 'Carne',
        menu_image: ExploreImage7
    },
]

export const food_list = [
    {
        _id: '99',
        name: 'teste',
        image: Pizza1,
        price: 0.50,
        description: 'Uma seleção incrível de pizzas tradicionais com sabores clássicos.',
        category: 'Pizza'
    },
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
    {
        _id: '6',
        name: 'Sushi Nigiri',
        image: Sushi1,
        price: 1.5,
        description: 'Tradicional sushi com fatia de peixe fresco sobre arroz temperado.',
        category: 'Sushi'
    },
    {
        _id: '7',
        name: 'Sushi Uramaki',
        image: Sushi2,
        price: 1.5,
        description: 'Sushi enrolado com arroz por fora e alga nori por dentro, recheado com peixe e vegetais.',
        category: 'Sushi'
    },
    {
        _id: '8',
        name: 'Sushi Oshi',
        image: Sushi3,
        price: 1.5,
        description: 'Sushi prensado em formato retangular, com camadas de arroz e peixe.',
        category: 'Sushi'
    },
    {
        _id: '9',
        name: 'Sushi Maki',
        image: Sushi4,
        price: 1.5,
        description: 'Clássico rolinho de sushi com alga nori por fora e recheio de peixe e arroz.',
        category: 'Sushi'
    },
    {
        _id: '10',
        name: 'Temaki Frito',
        image: Sushi5,
        price: 1.5,
        description: 'Temaki crocante e frito, recheado com peixe e arroz.',
        category: 'Sushi'
    },
    {
        _id: '11',
        name: 'Sushi Hot Roll',
        image: Sushi6,
        price: 1.5,
        description: 'Sushi empanado e frito, recheado com salmão e cream cheese.',
        category: 'Sushi'
    },
    /* CARNES >>>>*/
{
    _id: '12',
    name: 'Costela Assada ao Bafo',
    image: Meats1,
    price: 60,
    description: 'Costela assada lentamente ao bafo, suculenta e macia, com temperos especiais.',
    category: 'Carne'
},
{
    _id: '13',
    name: 'Frango Empanado Crocante',
    image: Meats2,
    price: 55,
    description: 'Frango empanado e frito, com crocância por fora e suculento por dentro, acompanhado de molho especial.',
    category: 'Carne'
},
{
    _id: '14',
    name: 'Carne de Panela Desfiada',
    image: Meats3,
    price: 35,
    description: 'Carne bovina cozida lentamente e desfiada, ideal para acompanhar arroz e farofa.',
    category: 'Carne'
},
{
    _id: '15',
    name: 'Picanha Grelhada',
    image: Meats4,
    price: 40,
    description: 'Picanha suculenta grelhada na brasa, servida com acompanhamentos tradicionais.',
    category: 'Carne'
},
{
    _id: '16',
    name: 'Picanha ao Molho Chimichurri',
    image: Meats5,
    price: 65,
    description: 'Picanha grelhada no ponto, acompanhada de um delicioso molho chimichurri.',
    category: 'Carne'
},

/* ALMOÇOS >>>>*/
{
    _id: '17',
    name: 'Almoço Bife de Mignon',
    image: Dinner1,
    price: 60,
    description: 'Bife de filé mignon grelhado, acompanhado de arroz, feijão e batata frita.',
    category: 'Carne'
},
{
    _id: '18',
    name: 'Almoço Frango Crocante',
    image: Dinner2,
    price: 55,
    description: 'Frango empanado crocante, servido com arroz, salada e purê de batata.',
    category: 'Carne'
},
{
    _id: '19',
    name: 'Almoço Frango Grelhado Saudável',
    image: Dinner3,
    price: 35,
    description: 'Peito de frango grelhado, servido com legumes assados e arroz integral.',
    category: 'Carne'
},
{
    _id: '20',
    name: 'Almoço Cupim Assado',
    image: Dinner4,
    price: 40,
    description: 'Cupim assado lentamente, servido com arroz, feijão e farofa.',
    category: 'Carne'
},
{
    _id: '21',
    name: 'Bife ao Molho com Batata Frita',
    image: Dinner5,
    price: 65,
    description: 'Bife ao molho madeira, acompanhado de batata frita crocante e arroz branco.',
    category: 'Carne'
},

/* FRITAS >>>>*/


    {
        _id: '22',
        name: 'Batata Frita Tradicional',
        image: Frites1,
        price: 60,
        description: 'Delicioso prato de batata frita feito de maneira tradicional.',
        category: 'Fritas'
    },
    {
        _id: '23',
        name: 'Batata Frita com pedaços de calabresa',
        image: Frites2,
        price: 55,
        description: ' Batata frita acompanhada de pedaços de calabresa.',
        category: 'Fritas'
    },
    {
        _id: '24',
        name: 'Batata Frita com queijo',
        image: Frites3,
        price: 35,
        description: ' Batata frita coberta com queijo derretido',
        category: 'Fritas'
    },
    {
        _id: '25',
        name: 'Batata Frita e calabresa',
        image: Frites4,
        price: 40,
        description: 'Batata frita servida com prato extra de calabresa.',
        category: 'Fritas'
    },
]

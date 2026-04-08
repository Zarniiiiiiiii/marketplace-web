import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const carData = [
  {
    title: 'BMW Seria 3 320d xDrive, automat, istoric service',
    description: 'BMW Seria 3 bine întreținut, cutie automată, interior îngrijit, fără probleme tehnice, ideal pentru drum lung și oraș.',
    brand: 'BMW',
    model: 'Seria 3',
    year: 2018,
    price: 17800,
    mileage: 186000,
    fuelType: 'DIESEL',
    transmission: 'AUTOMATIC',
    color: 'Negru',
    engine: '1995 cmc',
    horsepower: 190,
    locationCity: 'Iași',
    featuredImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80'
    ]),
    contactName: 'George Popescu',
    contactEmail: 'george@example.com',
    contactPhone: '0711111111'
  },
  {
    title: 'Audi A4 2.0 TDI, manuală, foarte economică',
    description: 'Mașină de familie, consum redus, distribuție schimbată, acte la zi, pregătită de drum.',
    brand: 'Audi',
    model: 'A4',
    year: 2017,
    price: 13900,
    mileage: 214000,
    fuelType: 'DIESEL',
    transmission: 'MANUAL',
    color: 'Gri',
    engine: '1968 cmc',
    horsepower: 150,
    locationCity: 'Bacău',
    featuredImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ]),
    contactName: 'Ana Ionescu',
    contactEmail: 'ana@example.com',
    contactPhone: '0722222222'
  },
  {
    title: 'Volkswagen Golf 7 1.6 TDI, perfect pentru oraș',
    description: 'Volkswagen Golf 7 în stare foarte bună, revizii la timp, ideal pentru navetă și utilizare zilnică.',
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2016,
    price: 10400,
    mileage: 201000,
    fuelType: 'DIESEL',
    transmission: 'MANUAL',
    color: 'Alb',
    engine: '1598 cmc',
    horsepower: 115,
    locationCity: 'București',
    featuredImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'
    ]),
    contactName: 'Mihai Dumitru',
    contactEmail: 'mihai@example.com',
    contactPhone: '0733333333'
  },
  {
    title: 'Mercedes-Benz C 220d, pachet AMG, interior piele',
    description: 'Mercedes C Class cu aspect elegant, motor economic, stare bună, interior premium și dotări foarte bune.',
    brand: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2019,
    price: 23200,
    mileage: 165000,
    fuelType: 'DIESEL',
    transmission: 'AUTOMATIC',
    color: 'Albastru',
    engine: '2143 cmc',
    horsepower: 194,
    locationCity: 'Cluj-Napoca',
    featuredImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80'
    ]),
    contactName: 'George Popescu',
    contactEmail: 'george@example.com',
    contactPhone: '0711111111'
  },
  {
    title: 'Skoda Octavia 2.0 TDI, spațioasă și fiabilă',
    description: 'Skoda Octavia potrivită pentru familie, portbagaj mare, consum mic, întreținere accesibilă.',
    brand: 'Skoda',
    model: 'Octavia',
    year: 2018,
    price: 12100,
    mileage: 198500,
    fuelType: 'DIESEL',
    transmission: 'MANUAL',
    color: 'Argintiu',
    engine: '1968 cmc',
    horsepower: 150,
    locationCity: 'Suceava',
    featuredImage: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80'
    ]),
    contactName: 'Ana Ionescu',
    contactEmail: 'ana@example.com',
    contactPhone: '0722222222'
  },
  {
    title: 'Dacia Duster 1.5 dCi, întreținută, bună la drumuri grele',
    description: 'Dacia Duster practică și robustă, potrivită pentru drumuri mixte, costuri mici de exploatare.',
    brand: 'Dacia',
    model: 'Duster',
    year: 2020,
    price: 15400,
    mileage: 112000,
    fuelType: 'DIESEL',
    transmission: 'MANUAL',
    color: 'Portocaliu',
    engine: '1461 cmc',
    horsepower: 115,
    locationCity: 'Brașov',
    featuredImage: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1200&q=80'
    ]),
    contactName: 'Mihai Dumitru',
    contactEmail: 'mihai@example.com',
    contactPhone: '0733333333'
  },
  {
    title: 'Toyota Corolla Hybrid, ideală pentru oraș',
    description: 'Toyota Corolla Hybrid foarte economică, întreținere bună, perfectă pentru trafic urban.',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2021,
    price: 20900,
    mileage: 72000,
    fuelType: 'HYBRID',
    transmission: 'AUTOMATIC',
    color: 'Roșu',
    engine: '1798 cmc',
    horsepower: 122,
    locationCity: 'Timișoara',
    featuredImage: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80'
    ]),
    contactName: 'George Popescu',
    contactEmail: 'george@example.com',
    contactPhone: '0711111111'
  },
  {
    title: 'Ford Focus 1.0 EcoBoost, benzină, ușor de întreținut',
    description: 'Ford Focus compact, bun pentru oraș, istoric service, aspect îngrijit.',
    brand: 'Ford',
    model: 'Focus',
    year: 2018,
    price: 9800,
    mileage: 144000,
    fuelType: 'PETROL',
    transmission: 'MANUAL',
    color: 'Alb',
    engine: '999 cmc',
    horsepower: 125,
    locationCity: 'Piatra Neamț',
    featuredImage: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80'
    ]),
    contactName: 'Ana Ionescu',
    contactEmail: 'ana@example.com',
    contactPhone: '0722222222'
  },

  {
    title: 'Opel Astra 1.6 CDTI, consum mic și costuri bune',
    description: 'Opel Astra potrivită pentru navetă și utilizare zilnică, bine întreținută și economică.',
    brand: 'Opel',
    model: 'Astra',
    year: 2017,
    price: 9300,
    mileage: 188000,
    fuelType: 'DIESEL',
    transmission: 'MANUAL',
    color: 'Gri',
    engine: '1598 cmc',
    horsepower: 110,
    locationCity: 'Constanța',
    featuredImage: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'George Popescu',
    contactEmail: 'george@example.com',
    contactPhone: '0711111111'
  },
  {
    title: 'Renault Megane 1.5 dCi, bună pentru drum lung',
    description: 'Renault Megane confortabilă, economică și potrivită pentru familie sau navetă.',
    brand: 'Renault',
    model: 'Megane',
    year: 2019,
    price: 11600,
    mileage: 154000,
    fuelType: 'DIESEL',
    transmission: 'MANUAL',
    color: 'Bleumarin',
    engine: '1461 cmc',
    horsepower: 115,
    locationCity: 'Craiova',
    featuredImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'Ana Ionescu',
    contactEmail: 'ana@example.com',
    contactPhone: '0722222222'
  },
  {
    title: 'Peugeot 3008 1.6 BlueHDi, crossover îngrijit',
    description: 'Peugeot 3008 cu interior modern, poziție înaltă la volan și consum bun.',
    brand: 'Peugeot',
    model: '3008',
    year: 2018,
    price: 14900,
    mileage: 163000,
    fuelType: 'DIESEL',
    transmission: 'MANUAL',
    color: 'Alb',
    engine: '1560 cmc',
    horsepower: 120,
    locationCity: 'Oradea',
    featuredImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'Mihai Dumitru',
    contactEmail: 'mihai@example.com',
    contactPhone: '0733333333'
  },
  {
    title: 'Nissan Qashqai 1.5 dCi, foarte practic în oraș',
    description: 'Qashqai bine întreținut, poziție bună la volan și costuri decente de întreținere.',
    brand: 'Nissan',
    model: 'Qashqai',
    year: 2016,
    price: 11800,
    mileage: 197000,
    fuelType: 'DIESEL',
    transmission: 'MANUAL',
    color: 'Negru',
    engine: '1461 cmc',
    horsepower: 110,
    locationCity: 'Galați',
    featuredImage: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'George Popescu',
    contactEmail: 'george@example.com',
    contactPhone: '0711111111'
  },
  {
    title: 'Hyundai Tucson 1.6 GDI, benzină, familie',
    description: 'SUV spațios, ideal pentru familie, întreținere bună și aspect plăcut.',
    brand: 'Hyundai',
    model: 'Tucson',
    year: 2019,
    price: 18400,
    mileage: 98000,
    fuelType: 'PETROL',
    transmission: 'MANUAL',
    color: 'Alb',
    engine: '1591 cmc',
    horsepower: 132,
    locationCity: 'Sibiu',
    featuredImage: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'Ana Ionescu',
    contactEmail: 'ana@example.com',
    contactPhone: '0722222222'
  },
  {
    title: 'Kia Sportage 1.7 CRDi, confort bun și consum ok',
    description: 'Kia Sportage practică și confortabilă, potrivită pentru drumuri zilnice și vacanțe.',
    brand: 'Kia',
    model: 'Sportage',
    year: 2017,
    price: 13950,
    mileage: 171000,
    fuelType: 'DIESEL',
    transmission: 'MANUAL',
    color: 'Maro',
    engine: '1685 cmc',
    horsepower: 115,
    locationCity: 'Arad',
    featuredImage: 'https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'Mihai Dumitru',
    contactEmail: 'mihai@example.com',
    contactPhone: '0733333333'
  },
  {
    title: 'Honda Civic 1.8 i-VTEC, benzină, fiabilă',
    description: 'Honda Civic recunoscută pentru fiabilitate, motor aspirat și întreținere decentă.',
    brand: 'Honda',
    model: 'Civic',
    year: 2015,
    price: 9900,
    mileage: 176000,
    fuelType: 'PETROL',
    transmission: 'MANUAL',
    color: 'Gri',
    engine: '1798 cmc',
    horsepower: 142,
    locationCity: 'Târgu Mureș',
    featuredImage: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'George Popescu',
    contactEmail: 'george@example.com',
    contactPhone: '0711111111'
  },
  {
    title: 'Mazda 3 2.0 Skyactiv, plăcută la condus',
    description: 'Mazda 3 cu motor pe benzină, cutie manuală și consum bun pentru clasa ei.',
    brand: 'Mazda',
    model: 'Mazda3',
    year: 2018,
    price: 13200,
    mileage: 128000,
    fuelType: 'PETROL',
    transmission: 'MANUAL',
    color: 'Roșu',
    engine: '1998 cmc',
    horsepower: 120,
    locationCity: 'Baia Mare',
    featuredImage: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'Ana Ionescu',
    contactEmail: 'ana@example.com',
    contactPhone: '0722222222'
  },
  {
    title: 'Volvo XC60 D4, premium, foarte sigur',
    description: 'Volvo XC60 cu dotări bune, confort excelent și reputație foarte bună la siguranță.',
    brand: 'Volvo',
    model: 'XC60',
    year: 2018,
    price: 23800,
    mileage: 149000,
    fuelType: 'DIESEL',
    transmission: 'AUTOMATIC',
    color: 'Gri',
    engine: '1969 cmc',
    horsepower: 190,
    locationCity: 'Ploiești',
    featuredImage: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'Mihai Dumitru',
    contactEmail: 'mihai@example.com',
    contactPhone: '0733333333'
  },
  {
    title: 'Tesla Model 3 Standard Range, electrică',
    description: 'Tesla Model 3, autonomie bună, costuri mici de exploatare și accelerație excelentă.',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2021,
    price: 29900,
    mileage: 64000,
    fuelType: 'ELECTRIC',
    transmission: 'AUTOMATIC',
    color: 'Alb',
    engine: 'Electric',
    horsepower: 283,
    locationCity: 'București',
    featuredImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'George Popescu',
    contactEmail: 'george@example.com',
    contactPhone: '0711111111'
  },
  {
    title: 'Lexus NX 300h, hybrid premium',
    description: 'Lexus NX hibrid, foarte confortabil, interior premium și consum bun pentru categorie.',
    brand: 'Lexus',
    model: 'NX',
    year: 2019,
    price: 27400,
    mileage: 101000,
    fuelType: 'HYBRID',
    transmission: 'AUTOMATIC',
    color: 'Gri',
    engine: '2494 cmc',
    horsepower: 197,
    locationCity: 'Iași',
    featuredImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'Ana Ionescu',
    contactEmail: 'ana@example.com',
    contactPhone: '0722222222'
  },
  {
    title: 'Seat Leon 2.0 TDI FR, sportivă și practică',
    description: 'Seat Leon FR, design sportiv, motor bun și ținută de drum foarte plăcută.',
    brand: 'Seat',
    model: 'Leon',
    year: 2017,
    price: 11700,
    mileage: 173000,
    fuelType: 'DIESEL',
    transmission: 'MANUAL',
    color: 'Roșu',
    engine: '1968 cmc',
    horsepower: 150,
    locationCity: 'Pitești',
    featuredImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'Mihai Dumitru',
    contactEmail: 'mihai@example.com',
    contactPhone: '0733333333'
  },
  {
    title: 'Audi Q5 2.0 TDI quattro, SUV premium',
    description: 'Audi Q5 cu tracțiune integrală, confort bun și dotări potrivite pentru drum lung.',
    brand: 'Audi',
    model: 'Q5',
    year: 2018,
    price: 24800,
    mileage: 158000,
    fuelType: 'DIESEL',
    transmission: 'AUTOMATIC',
    color: 'Negru',
    engine: '1968 cmc',
    horsepower: 190,
    locationCity: 'Botoșani',
    featuredImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'George Popescu',
    contactEmail: 'george@example.com',
    contactPhone: '0711111111'
  },
  {
    title: 'BMW X3 xDrive20d, automat, stare foarte bună',
    description: 'BMW X3 cu motor diesel economic, cutie automată și interior foarte bine păstrat.',
    brand: 'BMW',
    model: 'X3',
    year: 2019,
    price: 28900,
    mileage: 133000,
    fuelType: 'DIESEL',
    transmission: 'AUTOMATIC',
    color: 'Alb',
    engine: '1995 cmc',
    horsepower: 190,
    locationCity: 'Alba Iulia',
    featuredImage: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'Ana Ionescu',
    contactEmail: 'ana@example.com',
    contactPhone: '0722222222'
  },
  {
    title: 'Ford Kuga 2.0 TDCi, spațioasă și comodă',
    description: 'Ford Kuga potrivită pentru familie, poziție bună la volan și portbagaj generos.',
    brand: 'Ford',
    model: 'Kuga',
    year: 2018,
    price: 15800,
    mileage: 142000,
    fuelType: 'DIESEL',
    transmission: 'MANUAL',
    color: 'Bleu',
    engine: '1997 cmc',
    horsepower: 150,
    locationCity: 'Satu Mare',
    featuredImage: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'Mihai Dumitru',
    contactEmail: 'mihai@example.com',
    contactPhone: '0733333333'
  },
  {
    title: 'Dacia Logan 0.9 TCe, ieftină și practică',
    description: 'Dacia Logan întreținută, foarte bună pentru oraș și costuri de exploatare mici.',
    brand: 'Dacia',
    model: 'Logan',
    year: 2019,
    price: 7800,
    mileage: 119000,
    fuelType: 'PETROL',
    transmission: 'MANUAL',
    color: 'Alb',
    engine: '898 cmc',
    horsepower: 90,
    locationCity: 'Focșani',
    featuredImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'George Popescu',
    contactEmail: 'george@example.com',
    contactPhone: '0711111111'
  },
  {
    title: 'Skoda Superb 2.0 TDI DSG, mare și confortabilă',
    description: 'Skoda Superb cu spațiu foarte bun, confort excelent și motor economic.',
    brand: 'Skoda',
    model: 'Superb',
    year: 2020,
    price: 21400,
    mileage: 109000,
    fuelType: 'DIESEL',
    transmission: 'AUTOMATIC',
    color: 'Negru',
    engine: '1968 cmc',
    horsepower: 190,
    locationCity: 'Râmnicu Vâlcea',
    featuredImage: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'Ana Ionescu',
    contactEmail: 'ana@example.com',
    contactPhone: '0722222222'
  },
  {
    title: 'Toyota RAV4 Hybrid, foarte economic pentru clasă',
    description: 'Toyota RAV4 Hybrid cu consum bun, fiabilitate excelentă și spațiu generos.',
    brand: 'Toyota',
    model: 'RAV4',
    year: 2020,
    price: 30900,
    mileage: 87000,
    fuelType: 'HYBRID',
    transmission: 'AUTOMATIC',
    color: 'Gri',
    engine: '2487 cmc',
    horsepower: 218,
    locationCity: 'Târgu Jiu',
    featuredImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'Mihai Dumitru',
    contactEmail: 'mihai@example.com',
    contactPhone: '0733333333'
  },
  {
    title: 'Volkswagen Passat 2.0 TDI DSG, excelent la drum lung',
    description: 'Passat bine întreținut, foarte comod și economic pentru cei care merg mult.',
    brand: 'Volkswagen',
    model: 'Passat',
    year: 2018,
    price: 16800,
    mileage: 182000,
    fuelType: 'DIESEL',
    transmission: 'AUTOMATIC',
    color: 'Argintiu',
    engine: '1968 cmc',
    horsepower: 150,
    locationCity: 'Deva',
    featuredImage: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'George Popescu',
    contactEmail: 'george@example.com',
    contactPhone: '0711111111'
  },
  {
    title: 'Mercedes-Benz GLC 220d 4Matic, SUV elegant',
    description: 'GLC 220d cu tracțiune integrală, interior premium și dotări bune.',
    brand: 'Mercedes-Benz',
    model: 'GLC',
    year: 2019,
    price: 33400,
    mileage: 121000,
    fuelType: 'DIESEL',
    transmission: 'AUTOMATIC',
    color: 'Gri închis',
    engine: '2143 cmc',
    horsepower: 170,
    locationCity: 'Bistrița',
    featuredImage: 'https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'Ana Ionescu',
    contactEmail: 'ana@example.com',
    contactPhone: '0722222222'
  },
  {
    title: 'Hyundai i30 1.4 MPI, bună pentru oraș',
    description: 'Hyundai i30 pe benzină, simplă, fiabilă și convenabilă pentru costuri zilnice.',
    brand: 'Hyundai',
    model: 'i30',
    year: 2018,
    price: 9800,
    mileage: 129000,
    fuelType: 'PETROL',
    transmission: 'MANUAL',
    color: 'Alb',
    engine: '1368 cmc',
    horsepower: 100,
    locationCity: 'Slobozia',
    featuredImage: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'Mihai Dumitru',
    contactEmail: 'mihai@example.com',
    contactPhone: '0733333333'
  },
  {
    title: 'Kia Ceed 1.6 CRDi, mașină practică de familie',
    description: 'Kia Ceed economică și spațioasă, cu întreținere decentă și aspect bun.',
    brand: 'Kia',
    model: 'Ceed',
    year: 2019,
    price: 11200,
    mileage: 141000,
    fuelType: 'DIESEL',
    transmission: 'MANUAL',
    color: 'Gri',
    engine: '1598 cmc',
    horsepower: 115,
    locationCity: 'Reșița',
    featuredImage: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'George Popescu',
    contactEmail: 'george@example.com',
    contactPhone: '0711111111'
  },
  {
    title: 'Mazda CX-5 2.2 Skyactiv-D, aspect foarte bun',
    description: 'Mazda CX-5 spațioasă și confortabilă, cu design reușit și motor puternic.',
    brand: 'Mazda',
    model: 'CX-5',
    year: 2019,
    price: 22400,
    mileage: 117000,
    fuelType: 'DIESEL',
    transmission: 'AUTOMATIC',
    color: 'Roșu',
    engine: '2191 cmc',
    horsepower: 184,
    locationCity: 'Târgoviște',
    featuredImage: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80',
    gallery: JSON.stringify([]),
    contactName: 'Ana Ionescu',
    contactEmail: 'ana@example.com',
    contactPhone: '0722222222'
  }
];

async function main() {
  await prisma.favorite.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('Admin1234!', 10);
  const userPassword = await bcrypt.hash('User1234!', 10);

  await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'Marketplace',
      email: 'admin@marketplace.local',
      passwordHash: adminPassword,
      phone: '0700000000',
      city: 'Bacău',
      role: 'ADMIN'
    }
  });

  const users = await Promise.all([
    prisma.user.create({
      data: {
        firstName: 'George',
        lastName: 'Popescu',
        email: 'george@example.com',
        passwordHash: userPassword,
        phone: '0711111111',
        city: 'Iași'
      }
    }),
    prisma.user.create({
      data: {
        firstName: 'Ana',
        lastName: 'Ionescu',
        email: 'ana@example.com',
        passwordHash: userPassword,
        phone: '0722222222',
        city: 'Bacău'
      }
    }),
    prisma.user.create({
      data: {
        firstName: 'Mihai',
        lastName: 'Dumitru',
        email: 'mihai@example.com',
        passwordHash: userPassword,
        phone: '0733333333',
        city: 'București'
      }
    })
  ]);

  for (let i = 0; i < carData.length; i += 1) {
    await prisma.listing.create({
      data: {
        ...carData[i],
        ownerId: users[i % users.length].id,
        status: 'APPROVED',
        isPublished: true
      }
    });
  }

  const allListings = await prisma.listing.findMany();

  await prisma.favorite.createMany({
    data: [
      { userId: users[0].id, listingId: allListings[1].id },
      { userId: users[0].id, listingId: allListings[2].id },
      { userId: users[1].id, listingId: allListings[0].id }
    ]
  });

  console.log('Baza de date a fost populată cu succes.');
  console.log('Admin login: admin@marketplace.local / Admin1234!');
  console.log('User login: george@example.com / User1234!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
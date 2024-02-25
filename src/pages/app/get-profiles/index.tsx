import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Container } from '@/components/layouts/container';
import { Alert } from '@/components/molecules/alert';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const testData = {
  searchResults: {
    similaritySearchResults: {
      matches: [
        {
          id: '0c228bec-3064-4e39-a15f-618eeadf6b1f',
          score: 0.485876471,
          values: [],
          metadata: {
            id: '0c228bec-3064-4e39-a15f-618eeadf6b1f',
            tech_stack: [
              'react',
              'redux',
              'typescript',
              'webpack',
              'tailwindcss',
              'jest',
              'angular',
              'vuejs',
              'svelte',
              'storybook',
              'graphql',
              'firebase',
            ],
          },
        },
        {
          id: '01a58ec6-390e-4508-a48f-9a71e5eae690',
          score: 0.413614899,
          values: [],
          metadata: {
            id: '01a58ec6-390e-4508-a48f-9a71e5eae690',
            tech_stack: [
              'vuejs',
              'vuex',
              'nuxtjs',
              'javascriptes6',
              'html5',
              'css3',
              'sass',
              'nodejs',
              'express',
              'mongodb',
              'mysql',
              'docker',
              'nginx',
              'aws',
            ],
          },
        },
        {
          id: '366e5bd3-0e41-443b-a852-012585351252',
          score: 0.370029271,
          values: [],
          metadata: {
            id: '366e5bd3-0e41-443b-a852-012585351252',
            tech_stack: [
              'gogolang',
              'python',
              'java',
              'springframework',
              'microservices',
              'kubernetes',
              'terraform',
              'aws',
              'azure',
              'postgresql',
              'cassandra',
              'redis',
              'gitlabcicd',
            ],
          },
        },
        {
          id: '270b2023-ebaf-4207-a924-a757c19db4d9',
          score: 0.369560122,
          values: [],
          metadata: {
            id: '270b2023-ebaf-4207-a924-a757c19db4d9',
            tech_stack: [
              'python',
              'django',
              'flask',
              'rubyonrails',
              'restfulapis',
              'graphql',
              'java',
              'springboot',
              'kafka',
              'redis',
              'elasticsearch',
              'celery',
              'rabbitmq',
              'docker',
              'kubernetes',
            ],
          },
        },
        {
          id: '3318c581-74ff-487b-b3fa-1a4a71831c27',
          score: 0.337031543,
          values: [],
          metadata: {
            id: '3318c581-74ff-487b-b3fa-1a4a71831c27',
            tech_stack: [
              'unity3d',
              'c',
              'shaderprogramming',
              'blender',
              'photoshop',
              'unrealengine',
              'zbrush',
              'substancepainter',
              'machinelearning',
              'vrardevelopment',
            ],
          },
        },
      ],
      namespace: 'candidate_tech_stack',
    },
    questions: [],
  },
  candidates: [
    {
      id: '0c228bec-3064-4e39-a15f-618eeadf6b1f',
      resume:
        'Desarrolladora Frontend - Paula Vázquez Jiménez Santiago, Chile GitHub: github.com/paulavjimenez Portfolio: paulavjimenez.dev Linkedin: linkedin.com/in/paulavjimenez Email: paulav.jimenez@example.com Tel: +56 9 8765 4321\n  PERFIL ● Desarrolladora frontend con pasión por el diseño UI/UX y 4 años de experiencia. ● Experta en React, diseño adaptativo y rendimiento web. ● Colaboradora activa en proyectos de código abierto y comunidades de desarrollo.\n  TECHSTACK Principal React, Redux, TypeScript, Webpack, Tailwind CSS, Jest. Secundario Angular, Vue.js, Svelte, Storybook, GraphQL, Firebase.\n  EXPERIENCIA Ingeniera Frontend Santiago, Chile Digital Products Lab Desde Junio 2019 ● Liderar el desarrollo frontend de aplicaciones web utilizando React y TypeScript. ● Colaborar en la creación de librerías de componentes y garantizar la accesibilidad web.\n  Diseñadora UI/UX y Desarrolladora Valparaíso, Chile Startup Journey Enero 2017 - Mayo 2019 ● Diseño de experiencias de usuario y desarrollo de interfaces para aplicaciones móviles.\n  FORMACIÓN Universidad de Chile Professional en Diseño Gráfico 2012 - 2016\n  IDIOMAS Español - Nativo Inglés - Fluido\n  LOGROS ● Reconocida por diseñar una de las mejores interfaces del año en una competición nacional de diseño. ● Voluntaria en eventos de tecnología y mentora de programación para jóvenes estudiantes.',
      techStack: [
        'react',
        'redux',
        'typescript',
        'webpack',
        'tailwindcss',
        'jest',
        'angular',
        'vuejs',
        'svelte',
        'storybook',
        'graphql',
        'firebase',
      ],
      createdAt: '2024-02-23T21:14:07.043Z',
      updatedAt: '2024-02-23T21:14:07.043Z',
      score: 0.485876471,
      metadata: {
        id: '0c228bec-3064-4e39-a15f-618eeadf6b1f',
        tech_stack: [
          'react',
          'redux',
          'typescript',
          'webpack',
          'tailwindcss',
          'jest',
          'angular',
          'vuejs',
          'svelte',
          'storybook',
          'graphql',
          'firebase',
        ],
      },
    },
    {
      id: '01a58ec6-390e-4508-a48f-9a71e5eae690',
      resume:
        'Desarrollador Full Stack - María Teresa Cervantes Robles Barcelona, España Github: github.com/mtcrobles LinkedIn: linkedin.com/in/maria-teresa-cervantes Email: mtcervantes.dev@gmail.com Tel: +34 612 345 678\n  PERFIL ● Apasionada de la programación y el desarrollo web con más de 5 años de experiencia. ● Experta en full stack development, con sólidos conocimientos en front-end y back-end. ● Siempre buscando la excelencia en la calidad del código y optimización de procesos.\n  TECHSTACK Principal Vue.js, Vuex, Nuxt.js, JavaScript ES6, HTML5, CSS3, SASS. Secondary Node.js, Express, MongoDB, MySQL, Docker, Nginx, AWS.\n  EXPERIENCIA Desarrolladora Full Stack Barcelona, España Digital Dream - Agencia de Marketing Desde Enero 2020 ● Creación de aplicaciones web escalables y performantes para clientes de alto perfil en Vue.js y Nuxt.js. ● Implementación de soluciones backend con Node.js y servicios AWS.\n  Desarrolladora Frontend Madrid, España Fintech Soluciones Junio 2017 - Diciembre 2019 ● Diseñó interfaces atractivas y responsivas utilizando Vue.js. ● Colaboración en un equipo ágil para entregar características de alta calidad.\n  FORMACIÓN Universidad Politécnica de Cataluña Máster en Ingeniería Informática 2015 - 2017\n  Universidad Pompeu Fabra Grado en Ingeniería del Software 2010 - 2014\n  IDIOMAS Español - Nativo Inglés - Fluido Catalán - Avanzado\n  LOGROS ● Líder de un equipo de desarrollo que lanzó una aplicación financiera que alcanzó a más de 100k usuarios en su primer año. ● Certificación AWS Certified Developer.',
      techStack: [
        'vuejs',
        'vuex',
        'nuxtjs',
        'javascriptes6',
        'html5',
        'css3',
        'sass',
        'nodejs',
        'express',
        'mongodb',
        'mysql',
        'docker',
        'nginx',
        'aws',
      ],
      createdAt: '2024-02-23T21:14:08.650Z',
      updatedAt: '2024-02-23T21:14:08.650Z',
      score: 0.413614899,
      metadata: {
        id: '01a58ec6-390e-4508-a48f-9a71e5eae690',
        tech_stack: [
          'vuejs',
          'vuex',
          'nuxtjs',
          'javascriptes6',
          'html5',
          'css3',
          'sass',
          'nodejs',
          'express',
          'mongodb',
          'mysql',
          'docker',
          'nginx',
          'aws',
        ],
      },
    },
    {
      id: '366e5bd3-0e41-443b-a852-012585351252',
      resume:
        'Desarrollador de Software - Enrique Soto Martínez Sevilla, España Github: github.com/enriquesm Blog: devthoughts.com/@enriquesm LinkedIn: linkedin.com/in/enrique-soto-martinez Email: enrique.soto.dev@example.com Tel: +34 655 321 987\n  PERFIL ● Más de 7 años de experiencia en desarrollo de software y arquitectura de soluciones. ● Experto en desarrollo de sistemas backend y gestión de bases de datos escalables. ● Entusiasta de la automatización, CI/CD y la integración de sistemas.\n  TECHSTACK Principal Go (Golang), Python, Java, Spring Framework, Microservices. Secundario Kubernetes, Terraform, AWS, Azure, PostgreSQL, Cassandra, Redis, GitLab CI/CD.\n  EXPERIENCIA Ingeniero de Software Senior Sevilla, España Soluciones Integrales IT Desde Marzo 2018 ● Diseñar y desarrollar sistemas backend escalables utilizando Go, y microservicios. ● Implementar infraestructura como código y estrategias de CI/CD para mejorar la entrega de software.\n  Desarrollador de Aplicaciones Granada, España Tech Innovate Agosto 2015 - Febrero 2018 ● Desarrollo de aplicaciones web basadas en Java y Spring, integrando sistemas de pago.\n  FORMACIÓN Universidad de Sevilla Máster en Ingeniería de Software 2013 - 2015\n  Universidad de Granada Grado en Informática 2008 - 2013\n  IDIOMAS Español - Nativo Inglés - Avanzado\n  LOGROS ● Automatización de procesos que redujeron en un 30% el tiempo de despliegue de nuevas versiones. ● Mentor de programadores junior y organizador de talleres internos sobre prácticas de desarrollo.',
      techStack: [
        'gogolang',
        'python',
        'java',
        'springframework',
        'microservices',
        'kubernetes',
        'terraform',
        'aws',
        'azure',
        'postgresql',
        'cassandra',
        'redis',
        'gitlabcicd',
      ],
      createdAt: '2024-02-23T21:14:13.330Z',
      updatedAt: '2024-02-23T21:14:13.330Z',
      score: 0.370029271,
      metadata: {
        id: '366e5bd3-0e41-443b-a852-012585351252',
        tech_stack: [
          'gogolang',
          'python',
          'java',
          'springframework',
          'microservices',
          'kubernetes',
          'terraform',
          'aws',
          'azure',
          'postgresql',
          'cassandra',
          'redis',
          'gitlabcicd',
        ],
      },
    },
    {
      id: '270b2023-ebaf-4207-a924-a757c19db4d9',
      resume:
        'Desarrollador Backend - David López Gutiérrez Ciudad de México, México GitHub: github.com/dlcoder LinkedIn: linkedin.com/in/davidlópezgutierrez Email: davidbackenddev@example.com Tel: +52 55 7890 1234\n  PERFIL ● Más de 8 años de experiencia especializándome en el desarrollo backend y sistemas distribuidos. ● Fuerte habilidad para colaborar en equipos multidisciplinarios y en el diseño de arquitecturas complejas. ● Comprometido con la implementación de buenas prácticas y el desarrollo ágil.\n  TECHSTACK Principal Python, Django, Flask, Ruby on Rails, RESTful APIs, GraphQL. Secondary Java, Spring Boot, Kafka, Redis, Elasticsearch, Celery, RabbitMQ, Docker, Kubernetes.\n  EXPERIENCIA Ingeniero Backend Senior Ciudad de México, México Innovatech Soluciones Septiembre 2019 - Actualidad ● Diseño y desarrollo de microservicios robustos y de alta disponibilidad para sistemas de ecommerce. ● Mejoró el rendimiento del sistema en un 40% optimizando consultas y estructuras de datos.\n  Desarrollador de Software Monterrey, México TechAdvancers Marzo 2014 - Agosto 2019 ● Desarrolló APIs REST eficientes y seguras para aplicaciones móviles y web. ● Liderazgo de proyectos tecnológicos y mentoría a desarrolladores junior.\n  FORMACIÓN Instituto Tecnológico Autónomo de México (ITAM) Maestría en Ciencias de la Computación 2012 - 2014\n  Universidad Nacional Autónoma de México (UNAM) Licenciatura en Informática 2007 - 2011\n  IDIOMAS Español - Nativo Inglés - Avanzado\n  LOGROS ● Contribución al desarrollo de un sistema de pago en línea utilizado por más de 500 mil usuarios. ● Ponente en conferencias nacionales sobre arquitecturas de microservicios.',
      techStack: [
        'python',
        'django',
        'flask',
        'rubyonrails',
        'restfulapis',
        'graphql',
        'java',
        'springboot',
        'kafka',
        'redis',
        'elasticsearch',
        'celery',
        'rabbitmq',
        'docker',
        'kubernetes',
      ],
      createdAt: '2024-02-23T21:14:13.292Z',
      updatedAt: '2024-02-23T21:14:13.292Z',
      score: 0.369560122,
      metadata: {
        id: '270b2023-ebaf-4207-a924-a757c19db4d9',
        tech_stack: [
          'python',
          'django',
          'flask',
          'rubyonrails',
          'restfulapis',
          'graphql',
          'java',
          'springboot',
          'kafka',
          'redis',
          'elasticsearch',
          'celery',
          'rabbitmq',
          'docker',
          'kubernetes',
        ],
      },
    },
    {
      id: '3318c581-74ff-487b-b3fa-1a4a71831c27',
      resume:
        'Desarrolladora de Juegos - Ana Sofía Ramírez López Buenos Aires, Argentina GitHub: github.com/sofidevgame LinkedIn: linkedin.com/in/anasofía-ramirezgame Email: asramirezgamedev@example.com Tel: +54 9 11 2345 6789\n  PERFIL ● Creativa y técnica en el diseño y desarrollo de videojuegos con 6 años de experiencia. ● Especialista en Unity 3D, con habilidades en programación, arte y diseño de niveles. ● Comprometida con crear experiencias de juego envolventes y emocionantes para los jugadores.\n  TECHSTACK Principal Unity3D, C#, Shader programming, Blender, Photoshop. Secondary Unreal Engine, ZBrush, Substance Painter, Machine Learning, VR/AR development.\n  EXPERIENCIA Desarrolladora de Juegos Buenos Aires, Argentina Indie Game Studio Desde Julio 2018 ● Desarrollo de juegos indie aclamados por la crítica, desde la conceptualización hasta el lanzamiento. ● Impulsó la implementación de técnicas de IA para mejorar la inteligencia de los personajes del juego.\n  Artista y Programadora de Juegos Córdoba, Argentina Creative Minds Games Enero 2015 - Junio 2018 ● Creación de assets 3D y animaciones para juegos móviles y de PC. ● Programación de mecánicas y flujos de juego innovadores.\n  FORMACIÓN Universidad de Palermo Especialización en Diseño de Videojuegos 2012 - 2014\n  Universidad de Buenos Aires Licenciatura en Ciencias de la Computación 2008 - 2012\n  IDIOMAS Español - Nativo Inglés - Fluido\n  LOGROS ● Juego principal galardonado en el Festival Internacional de Videojuegos Independientes. ● Haber construido una comunidad de juego activa y comprometida con más de 50k seguidores.\n  Estos perfiles ficticios se pueden usar como referencia para tus pruebas de parseo de CV y para detectar las tecnologías y experiencias de los candidatos ficticios.',
      techStack: [
        'unity3d',
        'c',
        'shaderprogramming',
        'blender',
        'photoshop',
        'unrealengine',
        'zbrush',
        'substancepainter',
        'machinelearning',
        'vrardevelopment',
      ],
      createdAt: '2024-02-23T21:14:09.540Z',
      updatedAt: '2024-02-23T21:14:09.540Z',
      score: 0.337031543,
      metadata: {
        id: '3318c581-74ff-487b-b3fa-1a4a71831c27',
        tech_stack: [
          'unity3d',
          'c',
          'shaderprogramming',
          'blender',
          'photoshop',
          'unrealengine',
          'zbrush',
          'substancepainter',
          'machinelearning',
          'vrardevelopment',
        ],
      },
    },
  ],
};

type Response = {
  searchResults: {
    similaritySearchResults: {
      matches: {
        id: string;
        score: number;
        values: any[];
        metadata: {
          id: string;
          tech_stack: string[];
        };
      }[];
      namespace: string;
    };
    questions: any[];
  };
  candidates: {
    id: string;
    resume: string;
    techStack: string[];
    createdAt: string;
    updatedAt: string;
    score: number;
    metadata: {
      id: string;
      tech_stack: string[];
    };
  }[];
};

const getCandidatesProfiles = async (description: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/candidate/similar_candidates`,
    {
      method: 'POST',
      body: JSON.stringify({ description }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const json = await res.json();
  return json;
};

export default function DevProfiles() {
  const [description, setDescription] = useState('');
  const { data, isLoading, isError, error, refetch } = useQuery<Response>({
    queryKey: ['profiles'],
    queryFn: () => getCandidatesProfiles(description),
    enabled: false,
  });

  const handleGetProfiles = async () => {
    refetch();
  };

  console.log({ data, isLoading, isError, error });

  return (
    <Container className='w-full md:w-full md:px-12'>
      {!data && !testData ? (
        <>
          <Alert
            title='What kind of developer are you looking for?'
            description='Briefly describe the kind of developer you are looking for and we will find the best match for you.'
          />
          <Textarea
            placeholder='We are looking for a senior developer with React, Node.js, and MongoDB experience.'
            className='mt-4'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            onClick={handleGetProfiles}
            className='mt-4'
            disabled={isLoading || !description}
          >
            {isLoading ? 'Loading...' : 'Get Profiles'}
          </Button>
        </>
      ) : (
        <>
          <h1 className='my-6'>
            We found {testData.candidates.length} profiles that match your
            search
          </h1>
          {/* todo: create reusable table component */}
          <Table>
            <TableCaption>Profiles</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Profile</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Technologies</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testData.candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>{candidate.id}</TableCell>
                  <TableCell>{candidate.score}</TableCell>
                  <TableCell>{candidate.techStack.join(', ')}</TableCell>
                  <TableCell>
                    <Button>Download Resume</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </Container>
  );
}

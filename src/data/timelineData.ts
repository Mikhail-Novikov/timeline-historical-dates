export type TimelineEvent = {
  year: number;
  title: string;
  description: string;
};

export type TimelinePeriod = {
  id: string;
  category: string;
  startYear: number;
  endYear: number;
  events: TimelineEvent[];
};

export const timelineData: TimelinePeriod[] = [
  {
    id: 'cinema',
    category: 'Кино',
    startYear: 1987,
    endYear: 1991,
    events: [
      {
        year: 1987,
        title: '«Хищник», США',
        description: 'Режиссер Джон Мактирнан задает новый стандарт фантастического боевика.'
      },
      {
        year: 1988,
        title: '«Кто подставил кролика Роджера?»',
        description: 'Роберт Земекис соединяет анимацию и кино в масштабном эксперименте.'
      },
      {
        year: 1989,
        title: '«Назад в будущее 2»',
        description: 'Фильм расширил вселенную Марти Макфлая и закрепил культ серии.'
      },
      {
        year: 1990,
        title: '«Крепкий орешек 2»',
        description: 'Джон Макклейн снова спасает авиахаб, а жанр экшена меняет правила игры.'
      },
      {
        year: 1991,
        title: '«Терминатор 2»',
        description: 'Блокбастер Джеймса Кэмерона с революционной графикой и драмой.'
      }
    ]
  },
  {
    id: 'literature',
    category: 'Литература',
    startYear: 1992,
    endYear: 1997,
    events: [
      {
        year: 1992,
        title: 'Нобелевка — Дерек Уолкотт',
        description: 'Отмечен «за блестящий образец карибского эпоса в 64 разделах».'
      },
      {
        year: 1994,
        title: '«Бессонница» — Стивен Кинг',
        description: 'Роман связывает реализм с космологией Мультиверса Кинга.'
      },
      {
        year: 1995,
        title: 'Нобелевка — Шеймас Хини',
        description: 'Поэт из Ирландии за «лирическую красоту и этическую глубину».'
      },
      {
        year: 1997,
        title: '«Гарри Поттер и философский камень»',
        description: 'Дебютный роман Дж. К. Роулинг запускает мировое явление.'
      }
    ]
  },
  {
    id: 'science',
    category: 'Наука',
    startYear: 2015,
    endYear: 2022,
    events: [
      {
        year: 2015,
        title: 'Частное солнечное затмение',
        description: 'Явление наблюдали в Южной Африке и части Антарктиды 13 сентября.'
      },
      {
        year: 2016,
        title: 'Галактика GN-z11',
        description: 'Телескоп «Хаббл» обнаружил самую удалённую известную галактику.'
      },
      {
        year: 2017,
        title: 'Tesla Semi',
        description: 'Первый электрический грузовик представил Илона Маск.'
      },
      {
        year: 2018,
        title: 'Solar Probe Plus',
        description: 'Зонд NASA приблизился к Солнцу ближе, чем любая миссия ранее.'
      },
      {
        year: 2020,
        title: 'Квантовое превосходство Google',
        description: 'Sycamore выполнил вычисление за 200 секунд вместо 10 тыс. лет классики.'
      },
      {
        year: 2022,
        title: 'JWST передает первые снимки',
        description: 'Космический телескоп показал детальные снимки ранней Вселенной.'
      }
    ]
  },
  {
    id: 'music',
    category: 'Музыка',
    startYear: 2000,
    endYear: 2005,
    events: [
      {
        year: 2000,
        title: 'Radiohead — Kid A',
        description: 'Альбом переосмыслил электронное звучание альтернативы.'
      },
      {
        year: 2002,
        title: 'Грэмми для Alicia Keys',
        description: 'Певица получила пять наград за дебют Songs in A Minor.'
      },
      {
        year: 2003,
        title: 'iTunes Store',
        description: 'Apple запустила цифровые продажи и изменила музыкальный рынок.'
      },
      {
        year: 2005,
        title: 'Live 8',
        description: 'Серия концертов объединила миллионы зрителей ради благотворительности.'
      }
    ]
  },
  {
    id: 'tech',
    category: 'Технологии',
    startYear: 2006,
    endYear: 2012,
    events: [
      {
        year: 2007,
        title: 'iPhone',
        description: 'Apple представила смартфон, задавший новый стандарт UX.'
      },
      {
        year: 2008,
        title: 'Android 1.0',
        description: 'Открытая мобильная платформа от Google запускает экосистему устройств.'
      },
      {
        year: 2010,
        title: 'Клауд-компьютинг',
        description: 'AWS и Azure задают темп массовой миграции в облака.'
      },
      {
        year: 2012,
        title: 'Curiosity на Марсе',
        description: 'Ровер успешно совершает посадку и начинает миссию в кратере Гейл.'
      }
    ]
  },
  {
    id: 'sport',
    category: 'Спорт',
    startYear: 2013,
    endYear: 2018,
    events: [
      {
        year: 2014,
        title: 'ЧМ по футболу в Бразилии',
        description: 'Германия выиграла четвертый титул, обыграв Аргентину.'
      },
      {
        year: 2016,
        title: 'ОИ в Рио-де-Жанейро',
        description: 'Первые Игры в Южной Америке с рекордным числом стран-участниц.'
      },
      {
        year: 2018,
        title: 'ЧМ в России',
        description: 'Франция берет второй титул, а видео­повторы меняют правила игры.'
      }
    ]
  }
];


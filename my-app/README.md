Проектът представлява Praxis Booking Appointment Application – SPA, реализирана с React, React Router и Context API. Приложението позволява регистрация на потребители (пациенти), преглед на каталог с лекари, виждане на детайлна информация за лекар и онлайн записване на час (частен преглед или по здравна каса), с история на прегледите за всеки потребител. Има ролеви модел с четири роли: ADMIN, DOCTOR, ASSISTANT и USER, като достъпът до отделните части на системата е защитен с route guards.

Frontend (React SPA):

GitHub: https://github.com/mitetodb/booking-appointment-application

Backend (Spring REST API, използван от React приложението е необходим за пълната функционалност):

GitHub: https://github.com/mitetodb/booking-appointment-svc

Инструкции за стартиране:

1. Стартиране на REST API:

- Клониране на booking-appointment-svc

- Конфигуриране на MySQL / PostgreSQL през Docker (описано в README в backend репото)

- mvn spring-boot:run

2. Стартиране на React приложението:

- Клониране на booking-appointment-application

- npm install

- npm run dev

- Отваряне на адреса, изписан от Vite (обикновено http://localhost:5173)

Приложението използва client-side routing (React Router), контекст за автентикация, контролирани форми (login/register/booking), работа с REST API за CRUD операции върху appointments, както и базова валидация и обработка на грешки.

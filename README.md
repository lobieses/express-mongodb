# ENDPOINTS
- sign-up(POST)
    - data : {
        name: string,
        password: string,
        kind: Regular | Admin | Boss}
    - response: {refreshToken: string, accessToken: string}

- sign-in(POST)
    - data : {
        name: string,
        password: string}
    - response: {refreshToken: string, accessToken: string}

- logout(GET)
    - response: TEXT: Success logout 

- refresh(GET)
    - response: {refreshToken: string, accessToken: string}

- make-appointment(POST) 
  - data : {
    doctorId: string
    dateIso: string ('YYYY-MM-DD')
    from: string ('HH:MM')
    to: string ('HH:MM')
  }
  - response: {code 200}
  



# NOTICES

- App implement JWT token authorization,because you need to insert in header Authorization accessToken:
    - Authorization: 'bearer ${accessToken}'

- You can use " docker compose up " to prepare project

- I decided do hardcode doctors in prepare-doctors.ts, change it if you need

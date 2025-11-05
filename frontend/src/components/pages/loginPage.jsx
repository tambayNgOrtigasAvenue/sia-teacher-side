import React from 'react'
import Header from '../common/homepage/loginHeader'
import Footer from '../common/homepage/footer'
import Login from '../common/homepage/login'
const LoginPage = () => {
  return (
    <>
      <Header />
      <main className=''>
        <section id="home">
          <Login />
        </section>
      </main>
    </>
  )
}

export default LoginPage
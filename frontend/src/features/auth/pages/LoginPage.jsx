import React from 'react'
import Header from '../../../components/common/homepage/loginHeader'
import Footer from '../../../components/common/homepage/footer'
import Login from '../../../components/common/homepage/login'
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
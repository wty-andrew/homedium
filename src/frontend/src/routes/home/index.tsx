import { useAuth } from '../../contexts/auth'

const Home = () => {
  const { user, signIn, signOut } = useAuth()
  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-bold">
        {user ? `Welcome, ${user.email}` : 'Welcome'}
      </h1>

      <br />

      {user ? (
        <button type="button" onClick={signOut}>
          Sign Out
        </button>
      ) : (
        <button type="button" onClick={signIn}>
          Sign In
        </button>
      )}
    </div>
  )
}

export default Home

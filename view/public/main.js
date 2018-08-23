const url = `https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2F
www.googleapis.com%2Fauth%2Fplus.me%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20
https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code&
client_id=772605682821-mokqs27oamnsmav4dpssk9mt4hihmngi.apps.googleusercontent.com&
redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fuser%2Foauthcallback`

let body = document.body

let signinLink = document.createElement('a')

signinLink.setAttribute('href', url)

signinLink.textContent = 'sign in with google'

body.appendChild(signinLink)
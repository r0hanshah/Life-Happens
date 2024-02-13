import pyrebase

firebaseConfig={
  'apiKey': "AIzaSyBgDOWWLjlJXgWRtN_hkBk4InUCr6QqHng",
  'authDomain': "lifehappens-293da.firebaseapp.com",
  'projectId': "lifehappens-293da",
  'storageBucket': "lifehappens-293da.appspot.com",
  'messagingSenderId': "482058299460",
  'appId': "1:482058299460:web:92eff3955d7cf348c33411",
  'measurementId': "G-XDMYBRH5SV",
  'databaseURL': "https://lifehappens-293da-default-rtdb.firebaseio.com/"
}

firebase = pyrebase.initialize_app(firebaseConfig)
auth=firebase.auth()

def signUp():
  print("Sign up...")
  email=input("Enter Email: ")
  password= input("Enter Password: ")
  try:

    user=auth.create_user_with_email_and_password(email,password)
    print("Successfully created account!")
    askLogin=input("Do you want to login now?[y/n]")
    if askLogin=='y':
      login()
  except:
    print("Email already exists!")

def login():
  print("Login in...")
  email = input("Enter email: ")
  pasword = input("Enter password: ")
  try:
    login = auth.sign_in_with_email_and_password(email, pasword)
    print("Successfully logged in")
    print(auth.get_account_info(login['idToken']))
  except:
    print("Invalid email or password.")


ans=input("Are you a new user?[y/n]")
if ans=='y':
  signUp()
elif ans=='n':
  login()


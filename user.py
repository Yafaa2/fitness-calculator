"""Profile page endpoints and Backend"""
from flask import Blueprint,render_template,session,redirect


user = Blueprint('user',__name__)

@user.route('/profile',methods=['GET','POST'])
def profile():
    """Profile page for logged-in users"""
    if 'user' in session:
        return render_template('profile.html', user=session['user'])
    return redirect('/login')

@user.route('/logout')
def logout():
    """Logout and clear session"""
    session.pop('user', None)
    return redirect('/')

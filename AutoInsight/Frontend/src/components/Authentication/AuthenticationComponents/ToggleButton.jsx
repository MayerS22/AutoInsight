/* eslint-disable react/prop-types */
const ToggleButton = ({ isSignUp, onClick }) => {
    return (
      <>
        <p className="text-center text-purple-950 mt-4">
            {isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
            <button style={{ textUnderlineOffset: '8px' }}
                    onClick={onClick} className="text-purple-700 underline font-bold">
                    {isSignUp ? 'Log in' : 'Sign Up'}
            </button>
        </p>
      </>
    );
};

export default ToggleButton;
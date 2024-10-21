import React from 'react'

function Alert({ message, closeHandler }) {
    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="bg-red-500 text-white font-bold rounded-lg p-4 shadow-md" role="alert">
                <div className="flex items-center">
                    <button onClick={closeHandler}>
                        <svg className="w-5 h-5 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                    </button>
                    <p className="text-sm">{message}</p>
                </div>
            </div>
        </div>
    )
}

export default Alert
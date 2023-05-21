window.addEventListener('load', function () 
{
    const splashScreen = document.querySelector('.splash-screen');
    setTimeout(function () 
    {
        splashScreen.classList.add('fade');
    }, 1000);
}
);
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\RssController;

class HomeController extends Controller
{
    public function getHomePage()
    {
        return view('site/home');
    }


}

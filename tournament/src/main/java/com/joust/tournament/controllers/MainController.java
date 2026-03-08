package com.joust.tournament.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class MainController {

    @GetMapping("/")
    public String Home(Model model){
        model.addAttribute("title", "Головна сторінка");
        return "Home";
    }
    @GetMapping("/roli")
    public String roli(Model model){
        model.addAttribute("titel","Ролі");
        return "roli";
    }
}

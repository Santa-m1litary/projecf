package com.joust.tournament.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("title", "Головна сторінка");
        return "Home";
    }

    @GetMapping("/roli")
    public String roli(Model model) {
        model.addAttribute("title", "Реєстрація");
        return "roli";
    }

    @GetMapping("/rating")
    public String rating(Model model) {
        model.addAttribute("title", "Рейтинг");
        return "rating";
    }

    @GetMapping("/tournaments")
    public String tournaments(Model model) {
        model.addAttribute("title", "Турніри");
        return "tournaments";
    }
}

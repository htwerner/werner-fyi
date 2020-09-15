package com.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class ForwardController {
    @GetMapping(value = {
            "/home",
            "/apps/covid",
            "/apps/systemic-racism",
            "/apps/pretzels",
            "/apps/tacos"})
    public String frontend() {
        return "forward:/";
    }
}
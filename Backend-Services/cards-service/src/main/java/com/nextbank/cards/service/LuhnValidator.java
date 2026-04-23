package com.nextbank.cards.service;

import org.springframework.stereotype.Component;
import java.util.Random;

@Component
public class LuhnValidator {

    public static boolean validate(String number) {
        int sum = 0;
        boolean alternate = false;
        for (int i = number.length() - 1; i >= 0; i--) {
            int n = Character.getNumericValue(number.charAt(i));
            if (alternate) {
                n *= 2;
                if (n > 9) n -= 9;
            }
            sum += n;
            alternate = !alternate;
        }
        return sum % 10 == 0;
    }

    public static String generate(String prefix) {
        Random random = new Random();
        StringBuilder number = new StringBuilder(prefix);
        
        // Generate up to 15 digits total
        while (number.length() < 15) {
            number.append(random.nextInt(10));
        }
        
        // Calculate the check digit
        int sum = 0;
        boolean alternate = true; // because we will add 1 more digit, making the current length even/odd shifted
        
        for (int i = number.length() - 1; i >= 0; i--) {
            int n = Character.getNumericValue(number.charAt(i));
            if (alternate) {
                n *= 2;
                if (n > 9) n -= 9;
            }
            sum += n;
            alternate = !alternate;
        }
        
        int checkDigit = (10 - (sum % 10)) % 10;
        number.append(checkDigit);
        
        return number.toString();
    }
}

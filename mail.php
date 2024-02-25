<?php

// echo "Hello from PHP!";

$data = json_decode(file_get_contents("php://input"), true);
// echo "\n\nJSON array from POST: \n";
// print_r($data);
// die();

// Формируем текст письма
$message = "<h2>Данные клиента</h2>";
$message .= "Сообщение от: {$data['form']['name']} <br>";
$message .= "Email:  {$data['form']['email']}<br>";
$message .= "Телефон:  {$data['form']['phone']}";
$message .= "<hr>";

// Текст письма, данные по заявке
$message .= "<h2>Данные по заявке</h2>";
$message .= "Стоимость недвижимости: {$data['data']['cost']} <br>";
$message .= "Первоначальный платеж: {$data['data']['payment']} <br>";
$message .= "Срок в годах: {$data['data']['time']} <br>";
$message .= "<hr>";

// Результаты расчета
$message .= "<h2>Результаты расчета</h2>";
$message .= "Процентная ставка: {$data['results']['rate']} <br>";
$message .= "Сумма кредита: {$data['results']['totalAmount']} <br>";
$message .= "Ежемесячный платеж: {$data['results']['monthPayment']} <br>";
$message .= "Переплата: {$data['results']['overPayment']} <br>";

// Отправляем письмо и результат отправки успех/неуспех true/false записываем в $result
$result = mail('info@mail.com', 'Заявка на ипотеку', $message);

// На основе успешной или не успешной отправки сообщаем SUCCESS или FAILED
// !!! Больше никакого вывода из данного файла быть не должно
// Никаких распечаток через echo, print_r и т.п. !!!
if ($result) {
    echo "SUCCESS";
} else {
    echo "FAILED";
}
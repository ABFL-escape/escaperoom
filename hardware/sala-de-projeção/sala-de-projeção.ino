#include <Ethernet.h>
#include <PubSubClient.h>

#define MQTT_SERVER "feira-de-jogos.dev.br"
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "escape-room-1"
#define MQTT_TOPIC_REQ "adc20251/escape-room/projecao"

byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xE1};
EthernetClient ethClient;
PubSubClient client(ethClient);

#define Led5 A0
#define Led6 A1
#define Led4 A2
#define Led1 A3
#define Led2 A4
#define Led3 A5

#define seta 5
#define sensPIR1 8
#define sensPIR2 7
#define sensIND1 2

int estado = 0;
bool PIR1;
bool PIR2;
bool IND1;

void piscarSeta()
{
  Serial.println("Piscando LEDs da porta de acesso...");

  for (int i = 0; i < 50; i++)
  {
    digitalWrite(seta, LOW);
    delay(200);
    digitalWrite(seta, HIGH);
    delay(200);
  }

  estado = 1;
}

void apagarSeta()
{
  Serial.println("Apagando LEDs da porta de acesso...");

  digitalWrite(seta, LOW);
}

void acenderSeta()
{
  Serial.println("Acendendo LEDs da porta de acesso...");

  digitalWrite(seta, HIGH);
}

void callback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Mensagem recebida:");
  Serial.println(topic);

  for (int _ = 0; _ < length; _++)
  {
    digitalWrite(LED_BUILTIN, LOW);
    delay(100);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(100);
  }

  if (payload[0] == 'p')
    piscarSeta();
}

void setup()
{
  Serial.begin(9600);
  pinMode(Led1, OUTPUT);
  pinMode(Led2, OUTPUT);
  pinMode(Led3, OUTPUT);
  pinMode(Led4, OUTPUT);
  pinMode(Led5, OUTPUT);
  pinMode(Led6, OUTPUT);
  pinMode(seta, OUTPUT);
  pinMode(sensPIR1, INPUT);
  pinMode(sensPIR2, INPUT);
  pinMode(sensIND1, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);

  Ethernet.begin(mac);
  while (Ethernet.linkStatus() == LinkOFF)
  {
    Serial.println("Aguardando a conexão Ethernet...");
    delay(500);
  }
  Serial.println("Conectado a Ethernet!");

  client.setServer(MQTT_SERVER, MQTT_PORT);
  client.setCallback(callback);
}

void loop()
{

  if (!client.connected())
  {
    digitalWrite(LED_BUILTIN, LOW);

    if (client.connect(MQTT_CLIENT_ID))
    {
      Serial.println("Conectado ao broker MQTT!");
      digitalWrite(LED_BUILTIN, HIGH);
      client.subscribe(MQTT_TOPIC_REQ, 1);
    }
    else
    {
      Serial.println("Broker MQTT: reconectando em 2s...");
      delay(2000);
    }
  }
  client.loop();

  if (estado == 1)
  {
    Serial.println(F("Aguardando sensores..."));
    digitalWrite(LED_BUILTIN, HIGH);
    estado = 2;
  }
  else if (estado == 2)
  {
    PIR1 = digitalRead(sensPIR1);
    Serial.print(F("Sensor de baixo "));
    Serial.println(PIR1);

    if (PIR1 == HIGH)
    {
      Serial.print(F("----> Detection"));
      delay(500);
      estado = 3;
    }
    delay(100);
  }
  else if (estado == 3)
  {
    PIR2 = digitalRead(sensPIR2);
    Serial.print(F("Sensor de cima "));
    Serial.println(PIR2);

    if (PIR2 == HIGH)
    {
      Serial.print(F("----> Detection"));
      delay(500);
      estado = 4;
    }
    delay(100);
  }
  else if (estado == 4)
  {
    IND1 = digitalRead(sensIND1);
    Serial.print(F("Sensor status"));
    Serial.println(IND1);

    digitalWrite(Led1, HIGH);
    delay(500);
    digitalWrite(Led2, HIGH);
    delay(500);
    digitalWrite(Led3, HIGH);
    delay(500);
    digitalWrite(Led4, HIGH);
    delay(500);
    digitalWrite(Led5, HIGH);
    delay(500);
    digitalWrite(Led6, HIGH);

    if (IND1 == LOW)
    {
      Serial.print(F("----> Detection"));
      delay(50);
      digitalWrite(Led1, LOW);
      delay(250);
      digitalWrite(Led2, LOW);
      delay(250);
      digitalWrite(Led3, LOW);
      delay(250);
      digitalWrite(Led4, LOW);
      delay(250);
      digitalWrite(Led5, LOW);
      delay(250);
      digitalWrite(Led6, LOW);

      estado = 5;
    }
  }
  else if (estado == 5)
  {
    digitalWrite(LED_BUILTIN, LOW);
    delay(500);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(500);
  }
}

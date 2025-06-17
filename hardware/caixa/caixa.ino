#include <Ethernet.h>
#include <PubSubClient.h>

#define MQTT_SERVER "feira-de-jogos.dev.br"
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "escape-room-0"
#define MQTT_TOPIC_REQ "adc20251/escape-room/caixa"

byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xE0};
EthernetClient ethClient;
PubSubClient client(ethClient);

#define CAIXA_0 A0
#define CAIXA_1 A1
#define LED_BUILTIN 13

void callback(char *topic, byte *payload, unsigned int length)
{  
  Serial.print("Mensagem recebida:");
  Serial.println(topic);
  for (int i = 0; i < 3; i++)
  {
    digitalWrite(LED_BUILTIN, LOW);
    delay(100);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(100);
  }
  if (payload[0] == 'a')
  {
    Serial.println("Abrindo a caixa...");
    digitalWrite(CAIXA_0, HIGH);
    digitalWrite(CAIXA_1, LOW);
  }
  else if (payload[0] == 'f')
  {
    Serial.println("Fechando a caixa...");
    digitalWrite(CAIXA_0, LOW);
    digitalWrite(CAIXA_1, HIGH);
  }
  else if (payload[0] == 'e')
  {
    Serial.println("Erro de senha!");
    //digitalWrite(MOTOR, HIGH);
    //client.publish(MQTT_TOPIC_RES, "1");
  } else
  {
    Serial.print("Código da caixa:");
    char digito1 = payload[0];
    char digito2 = payload[1];
    char digito3 = payload[2];
    Serial.print(digito1);
    Serial.print(digito2);
    Serial.println(digito3);
  }
}

void setup()
{
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(CAIXA_0, OUTPUT);
  pinMode(CAIXA_1, OUTPUT);
  digitalWrite(CAIXA_0,LOW);
  digitalWrite(CAIXA_1,LOW);

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
      Serial.print("Broker MQTT: reconectando em 5s...");
      delay(5000);
    }
  }
  client.loop();
}

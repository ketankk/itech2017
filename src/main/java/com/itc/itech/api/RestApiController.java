package com.itc.itech.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import service.ApiService;

import java.net.URL;

@RestController
@RequestMapping("/rest/service")
public class RestApiController {

    ApiService apiService = new ApiService();

//devices working
    @RequestMapping(value = "/devices", method = RequestMethod.GET, headers = "Accept=application/json")
    public ResponseEntity getAllDevices() {
        String url = "https://lwkwmlb7f7.execute-api.us-east-1.amazonaws.com/prod/alldevice";
        try {
            return ResponseEntity.ok(apiService.getResponse(new URL(url)));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;

    }
//topics not working
    @RequestMapping(value = "/topics", method = RequestMethod.GET, headers = "Accept=application/json")
    public ResponseEntity getAllTopics() {
        String url = "https://lwkwmlb7f7.execute-api.us-east-1.amazonaws.com/prod/alltopic";
        try {
            return ResponseEntity.ok(apiService.getResponse(new URL(url)));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;

    }

    @RequestMapping(value = "/topics", method = RequestMethod.PUT, headers = "Accept=application/json")
    public ResponseEntity createTopic() {
        String url = "https://lwkwmlb7f7.execute-api.us-east-1.amazonaws.com/prod/createtopic";
        try {
            return ResponseEntity.ok(apiService.getResponse(new URL(url)));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;

    }

    @RequestMapping(value = "/deliveryresults", method = RequestMethod.GET, headers = "Accept=application/json")
    public ResponseEntity getDeliveryResults(@RequestParam("") String msgId) {
        String url = "https://lwkwmlb7f7.execute-api.us-east-1.amazonaws.com/prod/deliveryresults?messageId=" + msgId;
        try {
            return ResponseEntity.ok(apiService.getResponse(new URL(url)));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;

    }

    @RequestMapping(value = "/registerdevices", method = RequestMethod.POST, headers = "Accept=application/json")
    public ResponseEntity registerDevices() {
        String url = "https://lwkwmlb7f7.execute-api.us-east-1.amazonaws.com/prod/alldevice";
        try {
            return ResponseEntity.ok(apiService.getResponse(new URL(url)));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;

    }

    @RequestMapping(value = "/subscribedevicestotopic", method = RequestMethod.GET, headers = "Accept=application/json")
    public ResponseEntity subscribeDevicesToTopic() {
        String url = "https://lwkwmlb7f7.execute-api.us-east-1.amazonaws.com/prod/subscribedevicestotopic";
        try {
            return ResponseEntity.ok(apiService.getResponse(new URL(url)));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;

    }

    @RequestMapping(value = "/topicMessage", method = RequestMethod.GET, headers = "Accept=application/json")
    public ResponseEntity getAllMessageOfTopic(@RequestParam("topicArn") String arn) {
        String url = "https://lwkwmlb7f7.execute-api.us-east-1.amazonaws.com/prod/allmessagesoftopic?"+arn;
        try {
            return ResponseEntity.ok(apiService.getResponse(new URL(url)));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;

    }

    @RequestMapping(value = "/publishToTopic", method = RequestMethod.POST, headers = "Accept=application/json")
    public ResponseEntity publishtoTopic(String data) {
        String url = "https://lwkwmlb7f7.execute-api.us-east-1.amazonaws.com/prod/publishtotopic";
        try {
            return ResponseEntity.ok(apiService.putResponse(new URL(url), data));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;

    }

    public static void main(String[] args) {

        RestApiController rac = new RestApiController();
        String data = "{topicArn: \"arn:aws:sns:us-east-1:038184107766:iTech2017Topic\", message: \"free\", sender: \"234\"}";
       //System.out.println( rac.publishtoTopic(data));
        String topicarn="arn=arn:aws:sns:us-east-1:038184107766:HR";
        System.out.println( rac.getAllTopics());

    }

}

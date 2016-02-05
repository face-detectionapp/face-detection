/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        this.onDeviceReady();
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        function drawFacesAddPoint(control, imgWidth, imgHeight, point, title) {
            var x = Math.round(point.x * imgWidth / 100);
            var y = Math.round(point.y * imgHeight / 100);
            var pointClass = title == null ? "api_face_all_point" : "api_face_point";
            var pointStyle = 'top: ' + y + 'px; left: ' + x + 'px;';
            var pointTitle = (title == null ? '' : title + ': ') + 'X=' + x + ', Y=' + y + ', Confidence=' + point.confidence + '%' + (title == null ? ', Id=' + point.id.toString(16) : '');
            control.append($('<span class="' + pointClass + '" style="' + pointStyle + '" title="' + pointTitle + '"></span>'));
        }
        function drawFaces(div, photo, drawPoints) {
            if (!photo) {
                alert("No image found");
                return;
            }
            if (photo.error_message) {
                alert(photo.error_message);
                return;
            }
            var imageWrapper = $('<div class="image_wrapper"></div>').appendTo(div);
            var maxImgWidth = parseInt(div.prev().children(".img_max_width").html(), 10);
            var maxImgHeight = parseInt(div.prev().children(".img_max_height").html(), 10);
            var imgWidth = photo.width;
            var imgHeight = photo.height;
            var scaleFactor = Math.min(maxImgWidth / imgWidth, maxImgHeight / imgHeight);
            if (scaleFactor < 1) {
                imgWidth = Math.round(imgWidth * scaleFactor);
                imgHeight = Math.round(imgHeight * scaleFactor);
            }
            imageWrapper.append($('<img alt="face detection results" width="' + imgWidth + 'px" height="' + imgHeight + 'px" src="' + photo.url + '" />'));
            if (photo.tags) {
                for (var i = 0; i < photo.tags.length; ++i) {
                    var tag = photo.tags[i];
                    var tagWidth = tag.width * 1.5;
                    var tagHeight = tag.height * 1.5;
                    var width = Math.round(tagWidth * imgWidth / 100);
                    var height = Math.round(tagHeight * imgHeight / 100);
                    var left = Math.round((tag.center.x - 0.5 * tagWidth) * imgWidth / 100);
                    var top = Math.round((tag.center.y - 0.5 * tagHeight) * imgHeight / 100);
                    if (drawPoints && tag.points) {
                        for (var p = 0; p < tag.points.length; p++) {
                            drawFacesAddPoint(imageWrapper, imgWidth, imgHeight, tag.points[p], null);
                        }
                    }
                    var tagStyle = 'top: ' + top + 'px; left: ' + left + 'px; width: ' + width + 'px; height: ' + height + 'px; transform: rotate(' +
                        tag.roll + 'deg); -ms-transform: rotate(' + tag.roll + 'deg); -moz-transform: rotate(' + tag.roll + 'deg); -webkit-transform: rotate(' +
                        tag.roll + 'deg); -o-transform: rotate(' + tag.roll + 'deg)';
                    var apiFaceTag = $('<div class="api_face" style="' + tagStyle + '"><div class="api_face_inner"><div class="api_face_inner_tid" name="' + tag.tid + '"></div></div></div>').appendTo(imageWrapper);
                    if (drawPoints) {
                        if (tag.eye_left) drawFacesAddPoint(imageWrapper, imgWidth, imgHeight, tag.eye_left, "Left eye");
                        if (tag.eye_right) drawFacesAddPoint(imageWrapper, imgWidth, imgHeight, tag.eye_right, "Right eye");
                        if (tag.mouth_center) drawFacesAddPoint(imageWrapper, imgWidth, imgHeight, tag.mouth_center, "Mouth center");
                        if (tag.nose) drawFacesAddPoint(imageWrapper, imgWidth, imgHeight, tag.nose, "Nose tip");
                    }
                }
            }
        }
        function callback(data) {
            drawFaces($("#conent_demo_image"), data.photos[0], true);
        }

        $("#send").on("click", function(e){
            e.preventDefault();
            // var photolink = "https://skybiometry.com/Content/Samples/one_i.jpg";
            var photolink = $("#photo_url").val();
            $.ajax({
                type: 'Get',
                url: 'http://api.skybiometry.com/fc/faces/detect.json?api_key=03e65dc0eec14f82b982eb577b521c32&api_secret=629181c4d4474bb4a89e5e0927b0ea8e&urls='+ photolink +'&attributes=all',
                dataType: 'jsonp',
                success: function(data){
                    //console.log(data.name);
                    //alert(data);
                    var options = new Object();
                    options.detect_all_feature_points = true;
                     console.log(data);

                    var Gender=
                            document.getElementById("gender");
                            data.photos[0].tags[0].attributes.gender.value;
                            










/*

                   //console.log("Gender: " +data.photos[0].tags[0].attributes.gender.value);
                    //console.log("Gender confidence: " +data.photos[0].tags[0].attributes.gender.confidence);

                   //console.log("Age_est: " +data.photos[0].tags[0].attributes.age_est.value);
                  //console.log("Age_est confidence: " +data.photos[0].tags[0].attributes.age_est.confidence);

                    //console.log("Dark_glasses: " +data.photos[0].tags[0].attributes.dark_glasses.value);
                    //console.log("Dark_glasses confidence: " +data.photos[0].tags[0].attributes.dark_glasses.confidence);

                    //console.log("anger: " +data.photos[0].tags[0].attributes.anger.value);
                    //console.log("Anger confidence: " +data.photos[0].tags[0].attributes.anger.confidence);

                    //console.log("Disgust: " +data.photos[0].tags[0].attributes.disgust.value);
                    //console.log("Disgust confidence: " +data.photos[0].tags[0].attributes.disgust.confidence);

                    //console.log("Eyes: " +data.photos[0].tags[0].attributes.eyes.value);
                    //console.log("Eyes confidence: " +data.photos[0].tags[0].attributes.eyes.confidence);

                    //console.log("Face: " +data.photos[0].tags[0].attributes.face.value);
                    //console.log("Face confidence: " +data.photos[0].tags[0].attributes.face.confidence);

                    //console.log("Fear: " +data.photos[0].tags[0].attributes.fear.value);
                    //console.log("Fear confidence: " +data.photos[0].tags[0].attributes.fear.confidence);

                   // console.log("Glasses: " +data.photos[0].tags[0].attributes.glasses.value);
                    //console.log("Glasses confidence: " +data.photos[0].tags[0].attributes.glasses.confidence);

                   // console.log("Happiness: " +data.photos[0].tags[0].attributes.happiness.value);
                    //console.log("Happiness confidence: " +data.photos[0].tags[0].attributes.happiness.confidence);

                    console.log("Lips: " +data.photos[0].tags[0].attributes.lips.value);
                    console.log("Lips confidence: " +data.photos[0].tags[0].attributes.lips.confidence);

                    console.log("Mood: " +data.photos[0].tags[0].attributes.mood.value);
                    console.log("Mood confidence: " +data.photos[0].tags[0].attributes.mood.confidence);

                    console.log("Neutral_mood: " +data.photos[0].tags[0].attributes.neutral_mood.value);
                    console.log("Neutral_mood confidence: " +data.photos[0].tags[0].attributes.neutral_mood.confidence);

                    console.log("Sadness: " +data.photos[0].tags[0].attributes.sadness.value);
                    console.log("Sadness confidence: " +data.photos[0].tags[0].attributes.sadness.confidence);

                    console.log("Smiling: " +data.photos[0].tags[0].attributes.smiling.value);
                    console.log("Smiling confidence: " +data.photos[0].tags[0].attributes.smiling.confidence);
                    */
                },
     receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

    }
                
            });
        });
        
    }
    
}

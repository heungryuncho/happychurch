"use client";

import { useEffect, useRef } from "react";

export default function NaverMap() {
    const mapElement = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 이미 스크립트가 추가되어 있는지 확인
        const existingScript = document.getElementById("naver-map-script");

        const initMap = () => {
            if (!mapElement.current || !window.naver?.maps) return;

            const location = new window.naver.maps.LatLng(37.396741, 126.735853);
            const mapOptions = {
                center: location,
                zoom: 17,
                minZoom: 10,
                scaleControl: false,
                logoControl: false,
                mapDataControl: false,
                zoomControl: true,
                zoomControlOptions: {
                    position: window.naver.maps.Position.TOP_RIGHT,
                },
            };

            const map = new window.naver.maps.Map(mapElement.current, mapOptions);

            new window.naver.maps.Marker({
                position: location,
                map,
                title: "행복한교회"
            });

            const infoWindow = new window.naver.maps.InfoWindow({
                content: `
                    <div style="padding: 16px; border-radius: 8px; min-width: 260px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); background: white;">
                        <h4 style="margin: 0 0 6px 0; font-weight: 800; font-size: 17px; color: #1f2937;">행복한교회</h4>
                        <p style="margin: 0 0 14px 0; font-size: 13.5px; color: #4b5563; line-height: 1.6; letter-spacing: -0.02em; word-break: keep-all;">
                            인천광역시 남동구 소래역남로 10<br/>
                            5층 501-1호, 501-2호
                        </p>
                        <a href="https://map.naver.com/v5/search/%EC%9D%B8%EC%B2%9C%EA%B4%91%EC%97%AD%EC%8B%9C%20%EB%82%A8%EB%8F%99%EA%B5%AC%20%EC%86%8C%EB%9E%98%EC%97%AD%EB%82%A8%EB%A1%9C%2010" target="_blank" rel="noopener noreferrer" style="display: inline-block; width: 85%; padding: 8px 0; background-color: #d4a853; color: white; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: bold; transition: background-color 0.2s;">
                            네이버 지도 크게보기
                        </a>
                    </div>
                `,
                backgroundColor: "transparent",
                borderWidth: 0,
                disableAnchor: true,
                pixelOffset: new window.naver.maps.Point(0, -10)
            });

            infoWindow.open(map, location);
        };

        if (existingScript) {
            // 이미 로드된 경우 바로 초기화
            if (window.naver && window.naver.maps) {
                initMap();
            } else {
                existingScript.addEventListener('load', initMap);
            }
        } else {
            // 스크립트 동적 생성 및 추가
            const script = document.createElement("script");
            script.id = "naver-map-script";
            script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=pt2xwrkpsx`;
            script.async = true;
            script.onload = initMap;
            document.head.appendChild(script);
        }

        return () => {
            if (existingScript) {
                existingScript.removeEventListener('load', initMap);
            }
        };
    }, []);

    return <div ref={mapElement} className="w-full h-full min-h-[400px]" style={{ zIndex: 0 }} />;
}
